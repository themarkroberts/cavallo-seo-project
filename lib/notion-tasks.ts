import { Client } from "@notionhq/client";
import { config } from "../config.ts";
import { requireEnv } from "./env.ts";
import type { Task, TaskSnapshot } from "./types.ts";

/**
 * Read the Notion Project Tasks database. READ-ONLY — nothing in this repo
 * writes to Notion. Throws on failure rather than returning an empty list,
 * so a broken connection can never look like "no tasks".
 */
export async function fetchTasks(): Promise<TaskSnapshot> {
  const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });

  let response;
  try {
    response = await notion.dataSources.query({
      data_source_id: config.notionTasksDataSourceId,
      sorts: [{ property: "Due Date", direction: "ascending" }],
    });
  } catch (cause) {
    throw new Error(
      `Notion task fetch failed for data source ${config.notionTasksDataSourceId}. ` +
        `Confirm NOTION_TOKEN is valid and the integration has been shared with the ` +
        `Project Tasks database. Original error: ${
          cause instanceof Error ? cause.message : String(cause)
        }`
    );
  }

  const tasks: Task[] = response.results.map((page) => {
    if (!("properties" in page)) {
      throw new Error(`Notion returned a page without properties: ${page.id}`);
    }
    const props = page.properties;

    const titleProp = props.Task;
    const name =
      titleProp && "type" in titleProp && titleProp.type === "title"
        ? titleProp.title.map((t: { plain_text: string }) => t.plain_text).join("")
        : "Untitled";

    const statusProp = props.Status;
    const status =
      statusProp && "type" in statusProp && statusProp.type === "select" && statusProp.select
        ? statusProp.select.name
        : "Unknown";

    const dueProp = props["Due Date"];
    const due =
      dueProp && "type" in dueProp && dueProp.type === "date" && dueProp.date
        ? dueProp.date.start
        : null;

    return { name, status, due };
  });

  return { fetchedAt: new Date().toISOString(), tasks };
}
