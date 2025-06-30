import React from "react";
import { NavLink } from "react-router-dom";
import {
  Compass,
  Film,
  Clock,
  LayoutDashboard,
  User,
  Store,
  Settings,
  MessageSquare,
  Rss,
  Coins,
  LucideIcon,
} from "lucide-react";
import { To } from "react-router-dom";

interface NavItemsProps {
  isExpanded: boolean;
}

interface NavItemWithPath {
  icon: LucideIcon;
  path: To;
  label: string;
  divider?: false;
}

type NavItem = NavItemWithPath | { divider: true };

const NavItems = ({ isExpanded }: NavItemsProps) => {
  const navItems: NavItem[] = [
    { icon: Compass, path: "/social/explore", label: "Explore" },
    { icon: Rss, path: "/social/feed", label: "Feed" },
    { icon: Film, path: "/social/reels", label: "Reels" },
    { icon: Store, path: "/social/store", label: "Store" },
    { icon: Clock, path: "/social/timeline", label: "Timeline" },
    { icon: LayoutDashboard, path: "/social/dashboard", label: "Dashboard" },
    { icon: User, path: "/social/profile", label: "Profile" },
    { divider: true } as const,
    { icon: MessageSquare, path: "/social/messenger", label: "Messenger" },
    { icon: Coins, path: "/social/subscription", label: "Subscription" },
    { divider: true } as const,
    { icon: Settings, path: "/social/settings", label: "Settings" },
  ];

  return (
    <div className="flex flex-col items-center space-y-2">
      {navItems.map((item, index) =>
        "divider" in item && item.divider ? (
          <div
            key={`divider-${index}`}
            className="w-full border-t border-zinc-800/50 my-4"
          />
        ) : (
          <div
            key={item.path.toString()}
            className={`flex ${
              isExpanded ? "w-full" : "w-auto"
            } transition-all`}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${
                  isExpanded ? "w-full justify-start px-4" : "justify-center"
                } p-3 rounded-lg transition-all ${
                  isActive
                    ? "metallic-shine bg-zinc-900 text-white shadow-md"
                    : "text-white/70 hover:bg-zinc-900/50 hover:text-white"
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {isExpanded && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </NavLink>
          </div>
        )
      )}
    </div>
  );
};

export default NavItems;
