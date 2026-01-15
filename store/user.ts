import { defineStore } from "pinia";
import { useApiFetch } from "~/composables/useApiFetch";
import type { ResponsesObject } from "openapi-typescript";
import type Roles from "~/interfaces/roles/roles";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref();
    const token = useCookie("accessToken", {
      maxAge: 2592000,
    });
    const seasonSportId = useCookie("seasonSportId", {
      maxAge: 2592000,
    });

    const setUser = (data: any) => (user.value = data);
    const setToken = (data: any) => (token.value = data);
    const setSeasonSportId = (data: any) => (seasonSportId.value = data);

    const forgetPassword = (email: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch(`/auth/forget-password`, {
            method: "post",
            body: { email },
          });
          resolve(response.data);
        } catch (error) {
          console.error("Error resetting password:", error);
          reject(error);
        }
      });
    };

    const verifyEmail = (token: string) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch(
            `/auth/verify-email?token=${token}`
          );
          resolve(response.data);
        } catch (error) {
          console.error("Error resetting password:", error);
          reject(error);
        }
      });
    };

    const resetPassword = (
      email: string,
      newPassword: string
    ): Promise<ResponsesObject> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/auth/reset-password", {
            method: "post",
            body: {
              email,
              newPassword,
            },
          });
          resolve(response.data);
        } catch (error) {
          console.error("Error resetting password:", error);
          reject(error);
        }
      });
    };

    const changePassword = (
      email: string,
      currentPassword: string,
      newPassword: string
    ) => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/auth/change-password", {
            method: "post",
            body: {
              email,
              currentPassword,
              newPassword,
            },
          });
          resolve(response.data);
        } catch (error) {
          console.error("Error resetting password:", error);
          reject(error);
        }
      });
    };

    const register = (
      name: string,
      email: string,
      password: string
    ): Promise<ResponsesObject> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/auth/register", {
            method: "post",
            body: {
              email,
              name,
              password,
            },
          });

          resolve(response);
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
            reject(error.message);
          } else {
            console.error("An unknown error occurred");
            reject("An unknown error occurred");
          }
        }
      });
    };

    const login = (
      email: string,
      password: string
    ): Promise<ResponsesObject> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/auth/login", {
            method: "post",
            body: {
              email: email,
              password: password,
            },
          });

          if (!response.data.value) {
            reject("Incorrect values.");
          } else {
            const { accessToken, season_sports, ...user } = response.data.value;
            const jwt = useCookie("accessToken", {
              maxAge: 2592000,
            });
            jwt.value = accessToken;
            setToken(accessToken);
            setUser({...user, season_sports: season_sports});
            if (!seasonSportId.value && season_sports.length) {
              setSeasonSportId(season_sports[0].id);
            }
            resolve(response.data);
          }
        } catch (error) {
          console.log(error);
          setToken(null);
          setUser(null);
          reject(error);
        }
      });
    };

    const addUser = (
      email: string,
      password: string,
      name: string
    ): Promise<void> => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/users", {
            method: "post",
            body: {
              email: email,
              password: password,
              name: name,
            },
          });

          resolve(response.data);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    };

    const getMe = (): Promise<void> | null => {
      return new Promise(async (resolve, reject) => {
        try {
          const response: any = await useApiFetch("/auth/me");

          if (response.data.value) {
            setUser(response.data.value);
            let season_sports = response.data.value.season_sports;
            if (!seasonSportId.value && season_sports.length) {
              setSeasonSportId(season_sports[0].id);
            }
          }

          resolve(response.data);
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    };

    const resetState = (): void => {
      setUser(null);
      setToken(null);
      setSeasonSportId(null);
      const authToken = useCookie("authToken", {
        maxAge: 2592000,
      });
      authToken.value = null;
    };

    const getUserRoleNames = () => {
      if (user.value && user.value.roles && Array.isArray(user.value.roles)) {
        return user.value.roles.map((role: Roles) => role.description);
      }
      return [];
    };

    const isAdmin = computed(() => {
      return (
        getUserRoleNames().includes("Association Admin") ||
        getUserRoleNames().includes("Super Admin")
      );
    });

    const isClubManager = computed(() => {
      return getUserRoleNames().includes("Club Manager");
    });

    const isTeamManager = computed(() => {
      return getUserRoleNames().includes("Team Manager");
    });

    const isCoach = computed(() => {
      if (!user.value || !user.value.roles || !Array.isArray(user.value.roles)) {
        return undefined;
      }
      return user.value.roles.find(
        (role: Roles) => role.id === 5 || role.id === 6 || role.id === 7
      );
    });

    return {
      user,
      token,
      seasonSportId,
      setUser,
      setToken,
      login,
      resetState,
      getMe,
      addUser,
      getUserRoleNames,
      register,
      resetPassword,
      verifyEmail,
      forgetPassword,
      isAdmin,
      setSeasonSportId,
      isClubManager,
      isTeamManager,
      isCoach,
      changePassword,
    };
  },
  {
    persist: {
      paths: ["token"],
    },
  }
);
