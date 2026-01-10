import { useApiV5Fetch } from "~/composables/useApiV5Fetch";
import type Game from "~/interfaces/games/game";
import type Courts from "~/interfaces/courts/courts";
import { useUserStore } from "~/store/user";

export const useGamesFetch = () => {
  async function fetchGameById(id: number): Promise<Game> {
    const response = await useApiV5Fetch(`games/${id}`);

    if (response.data?.value) {
      return response.data.value as Game;
    }
    return {} as Game;
  }

  async function updateGame(id: number, data: object) {
    const response = await useApiV5Fetch(`games/${id}`, {
      method: "PUT",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function getGameById(id: number): Promise<Game | null> {
    const response: { data?: { value?: Game } } = await useApiV5Fetch(
      `games/${id}`,
      {
        method: "GET",
      }
    );

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function changeHomeAway(id: number) {
    const response = await useApiV5Fetch(`games/${id}/home-away`, {
      method: "PUT",
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function deleteGame(id: number) {
    const response = await useApiV5Fetch(`games/${id}`, {
      method: "DELETE",
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function createGames(data: any) {
    const response = await useApiV5Fetch(`games`, {
      method: "POST",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function getGames(data: any) {
    const response = await useApiV5Fetch(`games`, {
      query: {
        is_deleted: false,
        ...data,
      },
    });

    if (response.data?.value) {
      return response.data.value as { count: number; rows: Array<Game> };
    }
  }

  async function getMovedGames(data: any) {
    const response = await useApiV5Fetch(`games/moved`, {
      query: {
        is_deleted: false,
        ...data,
      },
    });

    if (response.data?.value) {
      return response.data.value as { count: number; rows: Array<Game> };
    }
    return { count: 0, rows: [] as Array<Game> } as {
      count: number;
      rows: Array<Game>;
    };
  }

  async function getCancelledGames(data: any) {
    const response = await useApiV5Fetch(`games/cancelled`, {
      query: {
        isDeleted: false,
        ...data,
      },
    });

    if (response.data?.value) {
      return response.data.value as { count: number; rows: Array<Game> };
    }
    return { count: 0, rows: [] as Array<Game> } as {
      count: number;
      rows: Array<Game>;
    };
  }

  async function generateAllGames(tournamentId: number, seasonSportId: number) {
    try {
      const response = await useApiV5Fetch(`games/tournaments/${tournamentId}`, {
        method: "POST",
        query: {
          season_sport_id: seasonSportId,
        },
      });

      // Check if response has error status (422 for validation errors)
      if (response.status?.value === 'error') {
        const errorMessage = response.error.value?.data?.message || 'Validation error occurred';
        return {
          error: true,
          message: errorMessage,
        };
      }

      if (response.data?.value) {
        return response.data.value as Array<Game>;
      }
      return [] as Array<Game>;
    } catch (error: any) {
      // Handle any other errors
      return {
        error: true,
        message: error?.data?.message || error?.message || 'An error occurred while generating games',
      };
    }
  }

  async function deleteAllGames(tournamentId: number) {
    const response = await useApiV5Fetch(`games/tournaments/${tournamentId}`, {
      method: "DELETE",
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function fetchCourts(gameId: number) {
    const response = await useApiV5Fetch(`games/${gameId}/courts`);

    if (response.data?.value) {
      return response.data.value as {
        home_team_courts: Array<Courts>;
        guest_team_courts: Array<Courts>;
        additional_courts: Array<Courts>;
      };
    }
    return {
      home_team_courts: [],
      guest_team_courts: [],
      additional_courts: [],
    } as {
      home_team_courts: Array<Courts>;
      guest_team_courts: Array<Courts>;
      additional_courts: Array<Courts>;
    };
  }

  async function checkGame(gameId: number, data: any) {
    const response = await useApiV5Fetch(`games/${gameId}/check`, {
      method: "POST",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value as Array<{
        message: string;
        status: string;
        type: string;
        header: string;
      }>;
    }
    return [];
  }

  async function saveDateAndCourt(gameId: number, data: any) {
    const response = await useApiV5Fetch(`games/${gameId}/time-court`, {
      method: "PUT",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function saveOrganizerClub(gameId: number, data: any) {
    const response = await useApiV5Fetch(`games/${gameId}/organizer-club`, {
      method: "PUT",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function checkForConflicts(gameId: number) {
    const response = await useApiV5Fetch(`games/${gameId}/check-conflicts`);

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function postponeMatch(gameId: number, data: any) {
    const response = await useApiV5Fetch(`games/${gameId}/postpone`, {
      method: "POST",
      body: data,
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function getGamesWithReferees(
    seasonSportId: number,
    week: number,
    prio: string,
    status: string,
    region: string,
    day: string
  ) {
    const response = await useApiV5Fetch("games/game-refs", {
      method: "GET",
      query: {
        seasonSportId,
        week,
        prio,
        status,
        region,
        day,
      },
    });

    if (response.data?.value) {
      return response.data.value;
    }
    return null;
  }

  async function getGamesCount(data: any) {
    try {
      const response = await useApiV5Fetch(`games/counts`, {
        query: {
          isDeleted: false,
          ...data,
        },
      });

      if (response.data?.value !== undefined && typeof response.data.value === 'number') {
        return response.data.value as number;
      }

      // If response is an error object, return 0
      if (response.data?.value && typeof response.data.value === 'object' && 'error' in response.data.value) {
        return 0;
      }

      return 0;
    } catch (error) {
      console.error('Error fetching games count:', error);
      return 0;
    }
  }

  async function saveGameResult(gameId: number, data: any) {
    const response = await useApiV5Fetch(`games/${gameId}/set-result`, {
      method: 'POST',
      body: data
    })

    if (response.data?.value) {
      return response.data.value
    }
    return null
  }

  return {
    fetchGameById,
    updateGame,
    deleteGame,
    createGames,
    deleteAllGames,
    generateAllGames,
    getGames,
    changeHomeAway,
    fetchCourts,
    checkGame,
    saveDateAndCourt,
    saveOrganizerClub,
    checkForConflicts,
    postponeMatch,
    getGamesWithReferees,
    getMovedGames,
    getCancelledGames,
    getGamesCount,
    getGameById,
    saveGameResult
  };
};
