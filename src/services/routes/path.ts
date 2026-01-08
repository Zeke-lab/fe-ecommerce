export const AppConstantRoutes = {
  path: {
    get default() {
      return '/';
    },
    get auth() {
      return {
        get default() {
          return '/auth';
        },
        get login() {
          return `${this.default}/login`;
        },
        get register() {
          return `${this.default}/register`;
        },
      };
    },
    get admin() {
      return {
        get default() {
          return '/admin';
        },
        get dashboard() {
          return `${this.default}/dashboard`;
        },
      };
    },

    // get user(){

    // },
  },
};
