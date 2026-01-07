import { defineStore } from "pinia";
import { useUserStore } from "~/store/user";

export const useSidebarStore = defineStore("sidebar", () => {
  const navigations = [
    {
      label: "Dashboard",
      route: "/",
      type: "route",
      icon: ["fas", "gauge-high"],
      roles: ["Association Admin", "Super Admin"],
    },
    {
      label: "Fighting",
      route: "/fighting",
      type: "route",
      icon: ["fas", "calendar"],
      roles: [],
    },
    {
      label: "Calendar",
      route: "/calendar",
      type: "route",
      icon: ["fas", "calendar"],
      roles: [],
    },
    {
      label: "Leagues",
      route: "/leagues",
      type: "route",
      icon: ["fas", "calendar"],
      roles: [],
    },
    {
      label: "Admin",
      type: "group_name",
      roles: ["Super Admin"],
      children: [
        {
          label: "Super Admin",
          type: "route_group",
          roles: ["Super Admin"],
          icon: ["fas", "user-tie"],
          children: [
            {
              label: "Federations",
              type: "route",
              route: "/super-admin/federations",
              roles: ["Super Admin"],
              icon: ["fas", "gear"],
            },
            {
              label: "Sports",
              type: "route",
              route: "/super-admin/sports",
              roles: ["Super Admin"],
              icon: ["fas", "gear"],
            },
            {
              label: "Users",
              type: "route",
              route: "/super-admin/users",
              roles: ["Super Admin"],
              icon: ["fas", "gear"],
            },
          ],
        },
      ],
    },
    {
      label: "Federation Admin",
      type: "group_name",
      roles: ["Association Admin", "Super Admin"],
      children: [
        {
          label: "Games",
          type: "route_group",
          roles: ["Super Admin"],
          icon: ["fas", "volleyball"],
          children: [
            {
              label: "Attention",
              route: "/tournament/attention",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Deleted Matches",
              route: "/tournament/deleted-matches",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Moves",
              route: "/tournament/moves",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Cancellation/No-shows",
              route: "/tournament/cancellation",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Conflicts",
              route: "/tournament/conflicts",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Moving In Progress",
              route: "/tournament/moving-in-progress",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
        {
          label: "Tournament",
          type: "route_group",
          roles: ["Association Admin", "Super Admin"],
          icon: ["fas", "gear"],
          children: [
            {
              label: "Attention",
              route: "/tournament/attention",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Moves",
              route: "/tournament/moves",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Cancellation/No-shows",
              route: "/tournament/cancellation",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Conflicts",
              route: "/tournament/conflicts",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "GP",
              route: "/tournament/gp",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Clubs",
              route: "/tournament/clubs",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Venues",
              route: "/tournament/venues",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Times",
              route: "/tournament/times",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Blocked Periods",
              route: "/tournament/blocked-periods",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Registered",
              route: "/tournament/registered",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
        {
          label: "Judging",
          type: "route_group",
          roles: ["Association Ref Admin", "Association Admin", "Super Admin"],
          icon: ["fas", "gavel"],
          children: [
            {
              label: "Judges",
              route: "/judging/judges",
              type: "route",
              roles: [
                "Association Ref Admin",
                "Association Admin",
                "Super Admin",
              ],
            },
            {
              label: "Putting on",
              route: "/judging/putting-on",
              type: "route",
              roles: [
                "Association Ref Admin",
                "Association Admin",
                "Super Admin",
              ],
            },
            {
              label: "Fees - Awaiting Approval",
              route: "/judging/awaiting-fees",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Fees - All",
              route: "/judging/fees-all",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Vacancy",
              route: "/vacancy",
              type: "route",
              roles: ["Super Admin"],
            },

            {
              label: "Nominations",
              route: "/nominations",
              type: "route",
              roles: ["Super Admin"],
            },
          ],
        },
        {
          label: "Coaches",
          type: "route_group",
          roles: ["Association Admin", "Super Admin"],
          icon: ["fas", "users-rectangle"],
          children: [
            {
              label: "All Coaches",
              route: "/coaches/coaches",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Invalid Coaches",
              route: "/coaches/invalid",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
        {
          label: "Referees",
          type: "route_group",
          roles: ["Association Admin", "Super Admin"],
          icon: ["fas", "users-rectangle"],
          children: [
            {
              label: "All Referees",
              route: "/referees/referees",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Referee Attachment",
              route: "/referees/referee-attachment",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
        {
          label: "System",
          type: "route_group",
          roles: ["Association Admin", "Super Admin"],
          icon: ["fas", "users-rectangle"],
          children: [
            {
              label: "Sporty's Queue",
              route: "/system/sporty-queue",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Search User",
              route: "/system/search-user",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Emails",
              route: "/system/emails",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Data Export",
              route: "/system/data-export",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Data Import",
              route: "/system/data-import",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
      ],
    },
    {
      label: "Judging",
      type: "group_name",
      roles: ["Referee"],
      children: [
        {
          label: "Vacancy",
          route: "/vacancy",
          type: "route",
          roles: ["Referee"],
          icon: ["fas", "stop"],
        },
        {
          label: "Filter in MVP",
          route: "/filter-in-mvp",
          type: "route",
          roles: ["Referee"],
          icon: ["fas", "filter"],
        },
        {
          label: "Nominations",
          route: "/nominations",
          type: "route",
          roles: ["Referee"],
          icon: ["fas", "list-check"],
        },
        {
          label: "Fees",
          route: "/fees",
          type: "route",
          roles: ["Referee"],
          icon: ["fas", "money-bill"],
        },
      ],
    },
    {
      label: "Club Admin",
      type: "group_name",
      roles: [
        "Club Manager",
        "Ref Responsible",
        "Officials Responsible",
        "Team Manager",
        "Super Admin",
      ],
      children: [
        {
          label: "Registration",
          route: "/registration",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "pen-to-square"],
        },
        {
          label: "Attention",
          route: "/attention",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "exclamation"],
        },
        {
          label: "Conflicts",
          route: "/conflicts",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "question"],
        },
        {
          label: "Battle conduct",
          route: "/battle-conduct",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "exclamation"],
        },
        {
          label: "Deleted Matches",
          route: "/deleted-matches",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "minus-circle"],
        },
        {
          label: "Times",
          route: "/times",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "clock"],
        },
        {
          label: "Venues",
          route: "/venues",
          type: "route",
          roles: ["Ref Responsible", "Officials Responsible"],
          icon: ["fas", "landmark"],
        },
        {
          label: "Teams",
          route: "/teams",
          type: "route",
          roles: [
            "Club Manager",
            "Team Manager",
            "Ref Responsible",
            "Officials Responsible",
            "Super Admin",
          ],
          icon: ["fas", "users"],
        },
        {
          label: "Approve Roles",
          route: "/approve-roles",
          type: "route",
          roles: [
            "Club Manager",
            "Ref Responsible",
            "Officials Responsible",
            "Super Admin",
          ],
          icon: ["fas", "check"],
        },
        {
          label: "Users",
          route: "/users",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "user-group"],
        },
        {
          label: "Without MVP login",
          route: "/without-mvp-login",
          type: "route",
          roles: [
            "Club Manager",
            "Ref Responsible",
            "Officials Responsible",
            "Super Admin",
          ],
          icon: ["fas", "question"],
        },
      ],
    },
    {
      label: "Coach / Team Manager",
      type: "group_name",
      roles: ["Head Coach", "Assistant Coach", "Team Manager", "Super Admin"],
      children: [
        {
          label: "Match program",
          route: "/match-program",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "calendar"],
        },
        {
          label: "Battle conduct",
          route: "/battle-conduct",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "exclamation"],
        },
        {
          label: "Approve Roles",
          route: "/approve-roles",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "user"],
        },
        {
          label: "Users",
          route: "/users",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "user"],
        },
        {
          label: "Without MVP login",
          route: "/without-mvp-login",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "question"],
        },
        {
          label: "State",
          route: "/state",
          type: "route",
          roles: [
            "Head Coach",
            "Assistant Coach",
            "Team Manager",
            "Super Admin",
          ],
          icon: ["fas", "calculator"],
        },
      ],
    },
  ];

  const activeTab = ref("");

  const setActiveTab = (value: string) => (activeTab.value = value);

  function getNavigations() {
    const userStore = useUserStore();
    const userRoles = userStore.getUserRoleNames();

    let availableNavigations = JSON.parse(JSON.stringify(navigations)).filter(
      (navigation: any) => {
        if (!navigation.roles.length) {
          return true;
        }

        return !!navigation.roles.filter(
          (role: string) => userRoles.indexOf(role) > -1
        ).length;
      }
    );

    availableNavigations.map((navigation: any) => {
      if (navigation.type === "route") {
        return navigation;
      } else if (navigation.type === "group_name" && navigation.children) {
        // @ts-ignore
        navigation.children = navigation.children.filter((child) => {
          return child.roles.filter(
            (role: string) => userRoles.indexOf(role) > -1
          ).length;
        });

        navigation.children = navigation.children.map((child: any) => {
          if (child.type === "route_group" && child.children) {
            child.children = child.children.filter((child: any) => {
              return child.roles.filter(
                (role: string) => userRoles.indexOf(role) > -1
              ).length;
            });
          }
          return child;
        });
        return navigation;
      }
    });

    return availableNavigations;
  }

  return { getNavigations, activeTab, setActiveTab };
});
