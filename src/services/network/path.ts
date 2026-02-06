export const ApiConstantRoutes = {
  paths: {
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
    get categories() {
      return {
        get default() {
          return '/categories';
        },
        detail(id: number | string) {
          return `${this.default}/${id}`;
        },
      };
    },
    get products() {
      return {
        get default() {
          return '/products';
        },
        detail(id: number | string) {
          return `${this.default}/${id}`;
        },
      };
    },
    get orders() {
      return {
        get default() {
          return '/orders';
        },
        detail(id: number | string) {
          return `${this.default}/${id}`;
        },
      };
    },
    get adminOrders() {
      return {
        get default() {
          return '/admin/orders';
        },
        detail(id: number | string) {
          return `${this.default}/${id}`;
        },
      };
    },
  },
};
