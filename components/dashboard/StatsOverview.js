import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import {
  FileTextOutlined,
  FileImageOutlined,
  LayoutOutlined,
  SlidersOutlined,
  BorderOuterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FormOutlined,
} from "@ant-design/icons";

export default function StatsOverview({ data, loading }) {
  const router = useRouter();

  const stats = [
    {
      title: "Pages",
      value: data.pages.length,
      icon: FileTextOutlined,
      link: "/pages",
    },
    {
      title: "Media",
      value: data.media.length,
      icon: FileImageOutlined,
      link: "/gallery",
    },
    {
      title: "Navbars",
      value: data.navbars.length,
      icon: LayoutOutlined,
      link: "/navbars",
    },
    {
      title: "Sliders",
      value: data.sliders.length,
      icon: SlidersOutlined,
      link: "/sliders",
    },
    {
      title: "Footers",
      value: data.footers.length,
      icon: BorderOuterOutlined,
      link: "/footers",
    },
    {
      title: "Cards",
      value: data.cards.length,
      icon: AppstoreOutlined,
      link: "/cards",
    },
    {
      title: "Menus",
      value: data.menus.length,
      icon: UnorderedListOutlined,
      link: "/menus",
    },
    {
      title: "Forms",
      value: data.forms.length,
      icon: FormOutlined,
      link: "/formbuilder",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.button
          key={stat.title}
          type="button"
          onClick={() => router.push(stat.link)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="text-left bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:border-[#3498db] hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <stat.icon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            <CountUp end={loading ? 0 : stat.value} separator="," />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
