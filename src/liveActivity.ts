const GITHUB_API = "https://api.github.com"
export const GITHUB_USERNAME = "DwijKansagara"

export type GitHubProfile = {
  login: string
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

export type GitHubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  fork: boolean
  updated_at: string
}

export type GitHubActivity = {
  profile: GitHubProfile
  repositories: GitHubRepo[]
  refreshedAt: Date
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
    signal
  })

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchGitHubActivity(
  signal?: AbortSignal
): Promise<GitHubActivity> {
  const [profile, repositories] = await Promise.all([
    getJson<GitHubProfile>(`/users/${GITHUB_USERNAME}`, signal),
    getJson<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=6&type=owner`,
      signal
    )
  ])

  return {
    profile,
    repositories: repositories.filter(repository => !repository.fork),
    refreshedAt: new Date()
  }
}

export function formatUpdatedDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Recently updated"

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date)
}
