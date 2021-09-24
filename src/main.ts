import * as core from '@actions/core';
import * as github from '@actions/github';

const DEFAULT_FILE_PATH = 'random.json';
const MESSAGE = 'message';

export function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function getData(
  filePath = DEFAULT_FILE_PATH,
  ref: string,
  octokit: ReturnType<typeof github.getOctokit>,
): Promise<string[]> {
  const data = (
    await octokit.rest.repos.getContent({
      ...github.context.repo,
      path: filePath,
      ref,
    })
  ).data as { content: string };

  const jsonData = data.content;

  if (!jsonData) {
    throw new Error(`Could not find ${filePath} for commit ${ref}`);
  }

  return JSON.parse(Buffer.from(jsonData, 'base64').toString());
}

async function run(): Promise<void> {
  try {
    /**
     * Get Workflow Input
     */
    const GITHUB_TOKEN =
      core.getInput('GITHUB_TOKEN') || process.env.GITHUB_TOKEN;
    const JSON_FILE_PATH =
      core.getInput('JSON_FILE_PATH') || process.env.JSON_FILE_PATH;

    if (typeof GITHUB_TOKEN !== 'string') {
      throw new Error(
        'Invalid GITHUB_TOKEN: did you forget to set it in your action config?',
      );
    }

    /**
     * Read Data from JSON
     */
    const data = await getData(
      JSON_FILE_PATH,
      github.context.sha,
      github.getOctokit(GITHUB_TOKEN),
    );

    /**
     * Output random message
     */
    core.setOutput(MESSAGE, rand(data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
