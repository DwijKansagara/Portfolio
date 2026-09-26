import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchGitHubActivity, formatUpdatedDate } from "./liveActivity"

describe("live GitHub activity", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("loads the profile and excludes forked repositories", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ login: "DwijKansagara" })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, name: "Portfolio", fork: false },
          { id: 2, name: "Fork", fork: true }
        ]
      })

    vi.stubGlobal("fetch", fetchMock)

    const activity = await fetchGitHubActivity()

    expect(activity.profile.login).toBe("DwijKansagara")
    expect(activity.repositories).toHaveLength(1)
    expect(activity.repositories[0].name).toBe("Portfolio")
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("handles an invalid update timestamp", () => {
    expect(formatUpdatedDate("not-a-date")).toBe("Recently updated")
  })
})
