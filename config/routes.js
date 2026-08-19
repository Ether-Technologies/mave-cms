// config/routes.js
export const publicPages = ["/login", "/signup", "/portfolio"];

export const allowSignup = process.env.NEXT_PUBLIC_ALLOW_SIGNUP === "true";

// Function to check if a route is protected
export const isProtectedPage = (route) => {
  // If the route is in the publicPages list, it's not protected
  return !publicPages.includes(route);
};
