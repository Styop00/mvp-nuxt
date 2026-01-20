import { defineStore } from "pinia";
import { useUserStore } from "~/store/user";

export const useSidebarStore = defineStore("sidebar", () => {
  const navigations = [
    {
      label: "Dashboard",
      route: "/admin/",
      type: "route",
      icon: ["fas", "gauge-high"],
      roles: ["Association Admin", "Super Admin"],
    },
    {
      label: "Fighting",
      route: "/admin/fighting",
      type: "route",
      icon: ["fas", "calendar"],
      roles: [],
    },
    {
      label: "Calendar",
      route: "/admin/calendar",
      type: "route",
      icon: ["fas", "calendar"],
      roles: [],
    },
    {
      label: "Leagues",
      route: "/admin/leagues",
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
              route: "/admin/super-admin/federations",
              roles: ["Super Admin"],
              icon: ["fas", "gear"],
            },
            {
              label: "Sports",
              type: "route",
              route: "/admin/super-admin/sports",
              roles: ["Super Admin"],
              icon: ["fas", "gear"],
            },
            {
              label: "Users",
              type: "route",
              route: "/admin/super-admin/users",
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
              route: "/admin/tournament/attention",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Deleted Matches",
              route: "/admin/tournament/deleted-matches",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Moves",
              route: "/admin/tournament/moves",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Cancellation/No-shows",
              route: "/admin/tournament/cancellation",
              type: "route",
              roles: ["Super Admin"],
            },
            {
              label: "Conflicts",
              route: "/admin/tournament/conflicts",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Moving In Progress",
              route: "/admin/tournament/moving-in-progress",
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
              route: "/admin/tournament/attention",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Moves",
              route: "/admin/tournament/moves",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Cancellation/No-shows",
              route: "/admin/tournament/cancellation",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "Conflicts",
              route: "/admin/tournament/conflicts",
              type: "route",
              roles: ["Association Admin"],
            },
            {
              label: "GP",
              route: "/admin/tournament/gp",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Clubs",
              route: "/admin/tournament/clubs",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Venues",
              route: "/admin/tournament/venues",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Times",
              route: "/admin/tournament/times",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Blocked Periods",
              route: "/admin/tournament/blocked-periods",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            // {
            //   label: "Registered",
            //   route: "/admin/tournament/registered",
            //   type: "route",
            //   roles: ["Association Admin", "Super Admin"],
            // },
          ],
        },
        // {
        //   label: "Judging",
        //   type: "route_group",
        //   roles: ["Association Ref Admin", "Association Admin", "Super Admin"],
        //   icon: ["fas", "gavel"],
        //   children: [
        //     {
        //       label: "Judges",
        //       route: "/admin/judging/judges",
        //       type: "route",
        //       roles: [
        //         "Association Ref Admin",
        //         "Association Admin",
        //         "Super Admin",
        //       ],
        //     },
        //     {
        //       label: "Putting on",
        //       route: "/admin/judging/putting-on",
        //       type: "route",
        //       roles: [
        //         "Association Ref Admin",
        //         "Association Admin",
        //         "Super Admin",
        //       ],
        //     },
        //     {
        //       label: "Fees - Awaiting Approval",
        //       route: "/admin/judging/awaiting-fees",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Fees - All",
        //       route: "/admin/judging/fees-all",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Vacancy",
        //       route: "/admin/vacancy",
        //       type: "route",
        //       roles: ["Super Admin"],
        //     },
        //
        //     {
        //       label: "Nominations",
        //       route: "/admin/nominations",
        //       type: "route",
        //       roles: ["Super Admin"],
        //     },
        //   ],
        // },
        {
          label: "Coaches",
          type: "route_group",
          roles: ["Association Admin", "Super Admin"],
          icon: ["fas", "users-rectangle"],
          children: [
            {
              label: "All Coaches",
              route: "/admin/coaches/coaches",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            // {
            //   label: "Invalid Coaches",
            //   route: "/admin/coaches/invalid",
            //   type: "route",
            //   roles: ["Association Admin", "Super Admin"],
            // },
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
              route: "/admin/referees/referees",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
            {
              label: "Referee Attachment",
              route: "/admin/referees/referee-attachment",
              type: "route",
              roles: ["Association Admin", "Super Admin"],
            },
          ],
        },
        // {
        //   label: "System",
        //   type: "route_group",
        //   roles: ["Association Admin", "Super Admin"],
        //   icon: ["fas", "users-rectangle"],
        //   children: [
        //     {
        //       label: "Sporty's Queue",
        //       route: "/admin/system/sporty-queue",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Search User",
        //       route: "/admin/system/search-user",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Emails",
        //       route: "/admin/system/emails",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Data Export",
        //       route: "/admin/system/data-export",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //     {
        //       label: "Data Import",
        //       route: "/admin/system/data-import",
        //       type: "route",
        //       roles: ["Association Admin", "Super Admin"],
        //     },
        //   ],
        // },
      ],
    },
    // {
    //   label: "Judging",
    //   type: "group_name",
    //   roles: ["Referee"],
    //   children: [
    //     {
    //       label: "Vacancy",
    //       route: "/admin/vacancy",
    //       type: "route",
    //       roles: ["Referee"],
    //       icon: ["fas", "stop"],
    //     },
    //     {
    //       label: "Filter in MVP",
    //       route: "/admin/filter-in-mvp",
    //       type: "route",
    //       roles: ["Referee"],
    //       icon: ["fas", "filter"],
    //     },
    //     {
    //       label: "Nominations",
    //       route: "/admin/nominations",
    //       type: "route",
    //       roles: ["Referee"],
    //       icon: ["fas", "list-check"],
    //     },
    //     {
    //       label: "Fees",
    //       route: "/admin/fees",
    //       type: "route",
    //       roles: ["Referee"],
    //       icon: ["fas", "money-bill"],
    //     },
    //   ],
    // },
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
          route: "/admin/registration",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "pen-to-square"],
        },
        {
          label: "Attention",
          route: "/admin/attention",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "exclamation"],
        },
        {
          label: "Conflicts",
          route: "/admin/conflicts",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "question"],
        },
        {
          label: "Battle conduct",
          route: "/admin/battle-conduct",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "exclamation"],
        },
        {
          label: "Deleted Matches",
          route: "/admin/deleted-matches",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "minus-circle"],
        },
        {
          label: "Times",
          route: "/admin/times",
          type: "route",
          roles: ["Club Manager"],
          icon: ["fas", "clock"],
        },
        {
          label: "Venues",
          route: "/admin/venues",
          type: "route",
          roles: ["Ref Responsible", "Officials Responsible"],
          icon: ["fas", "landmark"],
        },
        {
          label: "Teams",
          route: "/admin/teams",
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
        // {
        //   label: "Approve Roles",
        //   route: "/admin/approve-roles",
        //   type: "route",
        //   roles: [
        //     "Club Manager",
        //     "Ref Responsible",
        //     "Officials Responsible",
        //     "Super Admin",
        //   ],
        //   icon: ["fas", "check"],
        // },
        {
          label: "Users",
          route: "/admin/users",
          type: "route",
          roles: ["Club Manager", "Ref Responsible", "Officials Responsible"],
          icon: ["fas", "user-group"],
        },
        // {
        //   label: "Without MVP login",
        //   route: "/admin/without-mvp-login",
        //   type: "route",
        //   roles: [
        //     "Club Manager",
        //     "Ref Responsible",
        //     "Officials Responsible",
        //     "Super Admin",
        //   ],
        //   icon: ["fas", "question"],
        // },
      ],
    },
    {
      label: "Coach / Team Manager",
      type: "group_name",
      roles: ["Head Coach", "Assistant Coach", "Team Manager", "Super Admin"],
      children: [
        {
          label: "Match program",
          route: "/admin/match-program",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "calendar"],
        },
        {
          label: "Battle conduct",
          route: "/admin/battle-conduct",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "exclamation"],
        },
        // {
        //   label: "Approve Roles",
        //   route: "/admin/approve-roles",
        //   type: "route",
        //   roles: ["Head Coach", "Assistant Coach", "Team Manager"],
        //   icon: ["fas", "user"],
        // },
        {
          label: "Users",
          route: "/admin/users",
          type: "route",
          roles: ["Head Coach", "Assistant Coach", "Team Manager"],
          icon: ["fas", "user"],
        },
        // {
        //   label: "Without MVP login",
        //   route: "/admin/without-mvp-login",
        //   type: "route",
        //   roles: ["Head Coach", "Assistant Coach", "Team Manager"],
        //   icon: ["fas", "question"],
        // },
        // {
        //   label: "State",
        //   route: "/admin/state",
        //   type: "route",
        //   roles: [
        //     "Head Coach",
        //     "Assistant Coach",
        //     "Team Manager",
        //     "Super Admin",
        //   ],
        //   icon: ["fas", "calculator"],
        // },
      ],
    },
  ];

  const activeTab = ref("");

  const setActiveTab = (value: string) => (activeTab.value = value);

  function getNavigations() {
    const userStore = useUserStore();
    const user_roles = userStore.getUserRoleNames();

    let availableNavigations = JSON.parse(JSON.stringify(navigations)).filter(
      (navigation: any) => {
        if (!navigation.roles.length) {
          return true;
        }

        return !!navigation.roles.filter(
          (role: string) => user_roles.indexOf(role) > -1
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
            (role: string) => user_roles.indexOf(role) > -1
          ).length;
        });

        navigation.children = navigation.children.map((child: any) => {
          if (child.type === "route_group" && child.children) {
            child.children = child.children.filter((child: any) => {
              return child.roles.filter(
                (role: string) => user_roles.indexOf(role) > -1
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
