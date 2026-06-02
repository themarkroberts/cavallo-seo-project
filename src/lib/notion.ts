import { Client } from "@notionhq/client";
import type { ClientConfig } from "./clients";

type NotionTask = {
  name: string;
  status: string;
  due: string | null;
};

export async function fetchNotionTasks(config: ClientConfig): Promise<NotionTask[]> {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    console.warn("NOTION_TOKEN not set — skipping Notion fetch");
    return [];
  }

  const notion = new Client({ auth: token });
  const { tasksDataSourceId, clientPageId } = config.notion;

  const response = await notion.dataSources.query({
    data_source_id: tasksDataSourceId,
    filter: {
      property: "Client",
      relation: {
        contains: clientPageId,
      },
    },
    sorts: [
      { property: "Due Date", direction: "ascending" },
    ],
  });

  return response.results.map((page) => {
    if (!("properties" in page)) return { name: "Unknown", status: "Unknown", due: null };

    const props = page.properties;

    const taskProp = props.Task;
    const name =
      taskProp && "type" in taskProp && taskProp.type === "title"
        ? taskProp.title.map((t: { plain_text: string }) => t.plain_text).join("")
        : "Untitled";

    const statusProp = props.Status;
    const status =
      statusProp && "type" in statusProp && statusProp.type === "select" && statusProp.select && "name" in statusProp.select
        ? (statusProp.select as { name: string }).name
        : "Unknown";

    const dueProp = props["Due Date"];
    const due =
      dueProp && "type" in dueProp && dueProp.type === "date" && dueProp.date && "start" in dueProp.date
        ? (dueProp.date as { start: string }).start
        : null;

    return { name, status, due };
  });
}
