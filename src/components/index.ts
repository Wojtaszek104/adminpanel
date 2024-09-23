import UpcommingEvents from "./home/upcoming-events";
import DealsChart from "./home/deals-chart";
import UpcommingEventsSkeleton from "./skeleton/upcoming-events"
import AccordionHeaderSkeleton from "./skeleton/accordion-header"
import ProjectCardSkeleton from "./skeleton/project-card"
import KanbanSkeleton from "./skeleton/kanban"
import DashboardTotalCountCard from "./home/total-count-card";
import LatestActivites from "./home/latest-activities";

export {
    UpcommingEvents, DealsChart,
    UpcommingEventsSkeleton, AccordionHeaderSkeleton,
    ProjectCardSkeleton, KanbanSkeleton, DashboardTotalCountCard,
    LatestActivites
};

export * from "./tags/user-tag";
export * from "./layout/text";
export * from "./accordion";
export * from "./tasks/form/description";
export * from "./tasks/form/due-date";
export * from "./tasks/form/header";
export * from "./tasks/form/stage";
export * from "./tasks/form/title";
export * from "./tasks/form/users";