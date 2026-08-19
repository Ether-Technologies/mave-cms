// components/LatestEvents.js
import {
  ContactsFilled,
  FileFilled,
  FileImageFilled,
  MessageFilled,
} from "@ant-design/icons";
import Image from "next/image";
import React from "react";

const allActivityLog = [
  {
    categoryType: 1,
    category: "Page",
    time: "09:15",
    type: "New Page",
    user: "Emily Johnson",
    description:
      "A new page titled 'Services' was created by Emily Johnson. This page outlines the range of services offered by the company.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "10:30",
    type: "Page Updated",
    user: "Michael Smith",
    description:
      "The 'Contact Us' page was updated by Michael Smith. New contact methods and an updated map have been added.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "11:45",
    type: "New Form Submitted",
    user: "Jane Doe",
    description:
      "A new contact form was submitted by Jane Doe. The form includes inquiries about partnership opportunities.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "12:00",
    type: "New Blog Post",
    user: "Alex Turner",
    description:
      "A new blog post titled 'Innovations in AI' has been published by Alex Turner. This post explores the latest advancements in artificial intelligence.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "13:20",
    type: "Page Published",
    user: "Sophia Lee",
    description:
      "The 'About Us' page was published by Sophia Lee, making it live on the website for all visitors.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "14:05",
    type: "Form Updated",
    user: "Daniel Kim",
    description:
      "The 'Newsletter Subscription' form was updated by Daniel Kim to include additional fields for user preferences.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "15:30",
    type: "Blog Post Updated",
    user: "Olivia Martinez",
    description:
      "The blog post 'Sustainable Energy Solutions' was updated by Olivia Martinez with new data and insights.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "16:45",
    type: "Page Deleted",
    user: "Liam Brown",
    description:
      "The 'Old Projects' page was deleted by Liam Brown as part of the website's cleanup process.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "17:10",
    type: "New Page",
    user: "Ava Davis",
    description:
      "A new page titled 'Careers' was created by Ava Davis. This page lists current job openings and internship opportunities.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "08:50",
    type: "New Form Submitted",
    user: "Noah Wilson",
    description:
      "A feedback form was submitted by Noah Wilson. The feedback includes suggestions for improving website navigation.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "09:30",
    type: "New Blog Post",
    user: "Isabella Moore",
    description:
      "A new blog post titled 'The Future of Renewable Energy' has been published by Isabella Moore, discussing upcoming trends in the energy sector.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "10:15",
    type: "Page Updated",
    user: "Mason Taylor",
    description:
      "The 'FAQ' page was updated by Mason Taylor to include answers to new frequently asked questions.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "11:00",
    type: "Page Published",
    user: "Mia Anderson",
    description:
      "The 'Testimonials' page was published by Mia Anderson, showcasing client feedback and success stories.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "12:30",
    type: "Form Deleted",
    user: "Ethan Thomas",
    description:
      "The obsolete 'Event Registration' form was deleted by Ethan Thomas to streamline user interactions.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "13:45",
    type: "Blog Post Published",
    user: "Charlotte Jackson",
    description:
      "The blog post 'Effective Marketing Strategies' was published by Charlotte Jackson, providing insights into successful marketing techniques.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "14:20",
    type: "New Page",
    user: "Amelia White",
    description:
      "A new page titled 'Portfolio' was created by Amelia White, displaying recent projects and case studies.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "15:00",
    type: "New Form Submitted",
    user: "Logan Harris",
    description:
      "A support request form was submitted by Logan Harris, seeking assistance with account setup.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "16:10",
    type: "Page Updated",
    user: "Harper Martin",
    description:
      "The 'Privacy Policy' page was updated by Harper Martin to comply with new regulations.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "17:25",
    type: "Blog Post Deleted",
    user: "Lucas Thompson",
    description:
      "The blog post 'Outdated SEO Techniques' was deleted by Lucas Thompson to maintain content relevance.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "18:40",
    type: "Page Unpublished",
    user: "Ella Garcia",
    description:
      "The 'Upcoming Events' page was unpublished by Ella Garcia as events were rescheduled.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "07:55",
    type: "Form Updated",
    user: "Benjamin Martinez",
    description:
      "The 'Job Application' form was updated by Benjamin Martinez to include additional fields for candidate experience.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "08:30",
    type: "New Blog Post",
    user: "Sofia Rodriguez",
    description:
      "A new blog post titled 'Cybersecurity Best Practices' has been published by Sofia Rodriguez, outlining essential security measures.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "09:45",
    type: "Page Deleted",
    user: "James Lewis",
    description:
      "The 'Deprecated Features' page was deleted by James Lewis as features were integrated into other sections.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "10:20",
    type: "New Page",
    user: "Lily Walker",
    description:
      "A new page titled 'Case Studies' was created by Lily Walker, detailing successful project implementations.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "11:35",
    type: "New Form Submitted",
    user: "Alexander Hall",
    description:
      "A survey form was submitted by Alexander Hall, providing feedback on the new website design.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "12:50",
    type: "Blog Post Updated",
    user: "Grace Allen",
    description:
      "The blog post 'Understanding Blockchain Technology' was updated by Grace Allen with the latest industry developments.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "13:10",
    type: "Page Published",
    user: "William Young",
    description:
      "The 'Terms of Service' page was published by William Young, outlining user agreements and policies.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "14:25",
    type: "Form Deleted",
    user: "Chloe Hernandez",
    description:
      "The outdated 'Feedback Form' was deleted by Chloe Hernandez to encourage the use of the new 'User Feedback' form.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "15:40",
    type: "Blog Post Published",
    user: "Daniel King",
    description:
      "The blog post 'Leveraging Data Analytics' was published by Daniel King, discussing data-driven decision-making.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "16:00",
    type: "New Page",
    user: "Victoria Wright",
    description:
      "A new page titled 'Testimonials' was created by Victoria Wright, featuring client success stories.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "17:15",
    type: "New Form Submitted",
    user: "Matthew Scott",
    description:
      "A registration form was submitted by Matthew Scott for the upcoming webinar on digital marketing.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "18:30",
    type: "Page Updated",
    user: "Abigail Green",
    description:
      "The 'Services' page was updated by Abigail Green to include new service offerings and updated pricing.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "19:45",
    type: "Blog Post Deleted",
    user: "Henry Adams",
    description:
      "The blog post 'Old Marketing Techniques' was deleted by Henry Adams to focus on current strategies.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "20:00",
    type: "Page Unpublished",
    user: "Ella Baker",
    description:
      "The 'Event Highlights' page was unpublished by Ella Baker as the events were concluded.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "07:25",
    type: "Form Updated",
    user: "Samuel Nelson",
    description:
      "The 'Customer Support' form was updated by Samuel Nelson to include additional support options.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "08:40",
    type: "New Blog Post",
    user: "Zoe Carter",
    description:
      "A new blog post titled 'E-commerce Trends in 2025' has been published by Zoe Carter, analyzing upcoming market movements.",
  },
  {
    categoryType: 2,
    category: "Page",
    time: "09:55",
    type: "Page Deleted",
    user: "Jack Perez",
    description:
      "The 'Legacy Documentation' page was deleted by Jack Perez to streamline available resources.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "10:10",
    type: "New Page",
    user: "Amelia Roberts",
    description:
      "A new page titled 'Our Team' was created by Amelia Roberts, introducing the company's leadership and staff.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "11:20",
    type: "New Form Submitted",
    user: "Oliver Turner",
    description:
      "A subscription form was submitted by Oliver Turner for the monthly newsletter.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "12:35",
    type: "Blog Post Updated",
    user: "Lily Collins",
    description:
      "The blog post 'Digital Transformation Strategies' was updated by Lily Collins with new case studies and statistics.",
  },
  {
    categoryType: 1,
    category: "Page",
    time: "13:50",
    type: "Page Published",
    user: "Jacob Stewart",
    description:
      "The 'Client Portal' page was published by Jacob Stewart, providing access to client resources and tools.",
  },
  {
    categoryType: 3,
    category: "Form",
    time: "14:05",
    type: "Form Deleted",
    user: "Grace Morris",
    description:
      "The 'Old Registration' form was deleted by Grace Morris in favor of the new streamlined 'User Registration' form.",
  },
  {
    categoryType: 4,
    category: "Blog",
    time: "15:20",
    type: "Blog Post Published",
    user: "Lucas Rogers",
    description:
      "The blog post 'Social Media Marketing Best Practices' was published by Lucas Rogers, offering tips for effective online engagement.",
  },
];

export const activityLog = allActivityLog.filter((log) => log.category !== "Blog");

export const activityIcons = [
  {
    id: 1,
    icon: <FileFilled className="text-[1.4rem] text-[#2980b9]" />,
    backgroundColor: "#FFF4DC",
  },
  {
    id: 2,
    icon: <FileImageFilled className="text-[1.4rem] text-[#2980b9]" />,
    backgroundColor: "#FFF4DC",
  },
  {
    id: 3,
    icon: <MessageFilled className="text-[1.4rem] text-[#2980b9]" />,
    backgroundColor: "#FFF4DC",
  },
  {
    id: 4,
    icon: <ContactsFilled className="text-[1.4rem] text-[#2980b9]" />,
    backgroundColor: "#FFF4DC",
  },
];

export default function LatestEvents() {
  return (
    <div className="border-2 border-gray-300 rounded-xl bg-white">
      <div className="flex justify-between items-center border-b-2 border-gray-300 p-3 mb-4">
        <h3 className="text-lg font-semibold">Digital Footprint</h3>
        <Image
          src="/icons/mave_icons/threedots.svg"
          alt="Three Dots"
          width={40}
          height={40}
          className="transform rotate-90"
        />
      </div>
      {/* Activity */}
      <div className="px-3 py-2 overflow-y-scroll h-96">
        {activityLog.map((log, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-5 gap-8 mb-6"
          >
            {/* Icon and Line */}
            <div className="flex flex-col items-center sm:col-span-1">
              {activityIcons.map((icon) => {
                if (icon.id === log.categoryType) {
                  return (
                    <div
                      key={icon.id}
                      className="bg-[#FFF4DC] w-16 h-16 flex justify-center items-center rounded-full mb-4"
                    >
                      {icon.icon}
                    </div>
                  );
                }
                return null;
              })}
              {index !== activityLog.length - 1 && (
                <div className="w-0.5 h-28 bg-gray-400"></div>
              )}
            </div>

            {/* Content */}
            <div className="sm:col-span-4 flex flex-col gap-4">
              {/* Time - Category - User */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Time */}
                <p className="p-2 bg-gray-200 rounded-full flex justify-center items-center text-mild-black text-sm">
                  {log.time}
                </p>

                {/* Category */}
                <p className="p-2 bg-gray-200 rounded-full flex justify-center items-center text-mild-black text-sm">
                  {log.category}
                </p>

                {/* User */}
                <p className="p-2 bg-gray-200 rounded-full flex justify-center items-center text-mild-black text-sm">
                  {log.user}
                </p>
              </div>
              {/* Description */}
              <div>
                <p className="text-mild-black text-base font-normal leading-relaxed">
                  {log.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* {console.log("Activity Log: ", activityLog)} */}
      </div>
    </div>
  );
}
