import { useEffect } from "react";
import { useRouter } from "next/router";

/** Menu items live on the Navigation page (combined with menus). */
const MenuItemsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/menus?tab=items");
  }, [router]);

  return null;
};

export default MenuItemsRedirect;
