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
        get products() {
          return `${this.dashboard}/products`;
        },
        get orders() {
          return `${this.dashboard}/orders`;
        },
        get categories() {
          return `${this.dashboard}/categories`;
        },
      };
    },

    get user() {
      return {
        get default() {
          return '/user';
        },
        get dashboard() {
          return `${this.default}/dashboard`;
        },
        get orders() {
          return `${this.dashboard}/orders`;
        },
        get browseProducts() {
          return `${this.dashboard}/browse-products`;
        },
        get profile() {
          return `${this.dashboard}/profile`;
        },
      };
    },
  },
};
