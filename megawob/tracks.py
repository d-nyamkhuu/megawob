"""Observation / action tracks: what an agent may see and do (MEGAWOB_INTERFACE).

    both   (default) BrowserGym's full observation (screenshot, AXTree, DOM, element boxes) and every action
           subset megawob registers (chat, infeas, bid, coord, nav, tab)
    pixel  screenshot + goal + chat only, and coordinate actions only (chat, infeas, coord): no bids, no
           AXTree / DOM / element boxes (extra_element_properties gives every element's box, a shortcut a
           pixel policy must not have)
    dom    AXTree / DOM text + goal + chat, no screenshot, and bid actions only (chat, infeas, bid, nav, tab).
           Tasks that need exact coordinates (sliders, drawing) may not be solvable here; dragSteps=split is forced
           to atomic (there is no bid press / release)

The action subsets apply to the BrowserGym action mapping (tasks.register_all); the observation side is
applied by the OpenEnv server (megawob.serve) and, for direct gym users, by TrackObservation:

    env = TrackObservation(gym.make("browsergym/miniwob.reorder-items"), track="pixel")
"""
from __future__ import annotations

from typing import Any

import gymnasium as gym

from . import catalog
from .catalog import INTERFACES  # MEGAWOB_INTERFACE is read on first use, by catalog.config()

SUBSETS = {
    "both": ["chat", "infeas", "bid", "coord", "nav", "tab"],
    "pixel": ["chat", "infeas", "coord"],
    "dom": ["chat", "infeas", "bid", "nav", "tab"],
}
# Observation keys each track keeps (None = all).
_COMMON = ("chat_messages", "goal", "goal_object", "url", "open_pages_urls", "open_pages_titles",
           "active_page_index", "last_action", "last_action_error", "elapsed_time")
KEEP = {
    "both": None,
    "pixel": _COMMON + ("screenshot",),
    "dom": _COMMON + ("dom_object", "axtree_object", "axtree_txt", "pruned_html", "focused_element_bid"),
}


def action_subsets(track: str | None = None) -> list[str]:
    """BrowserGym action subsets of a track (default: MEGAWOB_INTERFACE)."""
    return list(SUBSETS[track or catalog.config().interface])


def strip_obs(obs: dict, track: str | None = None) -> dict:
    """The observation a track's agent may see (a shallow copy; 'both' returns obs unchanged)."""
    keep = KEEP[track or catalog.config().interface]
    if keep is None or not isinstance(obs, dict):
        return obs
    return {k: v for k, v in obs.items() if k in keep}


class TrackObservation(gym.ObservationWrapper):
    """Drops the observation keys a track does not allow (direct gym use; the OpenEnv server does it itself).
    The observation space is left as BrowserGym declares it."""

    def __init__(self, env: gym.Env, track: str | None = None) -> None:
        track = track or catalog.config().interface
        super().__init__(env)
        if track not in INTERFACES:
            raise ValueError(f"track must be one of {INTERFACES}, got {track!r}")
        self.track = track

    def observation(self, observation: Any) -> Any:
        """The observation with the keys the track does not allow dropped."""
        return strip_obs(observation, self.track)
