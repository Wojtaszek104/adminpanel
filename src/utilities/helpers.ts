import dayjs from "dayjs";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { DashboardDealsChartQuery } from "@/graphql/types";

type DealStage = GetFieldsFromList<DashboardDealsChartQuery>;
type DealAggregate = DealStage["dealsAggregate"][0];

interface MappedDealData {
  timeUnix: number;
  timeText: string;
  value: number;
  state: string;
}

export const getDate = (startDate: string, endDate: string) => {
  const start = dayjs(startDate).format("MMM DD, YYYY - HH:mm");
  const end = dayjs(endDate).format("MMM DD, YYYY - HH:mm");

  return `${start} - ${end}`;
};

const filterDeal = (deal?: DealAggregate) =>
  deal?.groupBy && deal.groupBy?.closeDateMonth && deal.groupBy?.closeDateYear;

const mapDeals = (
  deals: DealAggregate[] = [],
  state: string
): MappedDealData[] => {
  return deals.filter(filterDeal).map((deal) => {
    const { closeDateMonth, closeDateYear } = deal.groupBy as NonNullable<
      DealAggregate["groupBy"]
    >;
    const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);

    return {
      timeUnix: date.unix(),
      timeText: date.format("MMM YYYY"),
      value: deal.sum?.value ?? 0,
      state,
    };
  });
};

export const mapDealsData = (
  dealStages: DealStage[] = []
): MappedDealData[] => {
  const won = dealStages.find((stage) => stage.title === "WON");
  const wonDeals = mapDeals(won?.dealsAggregate, "Won");
  const lost = dealStages.find((stage) => stage.title === "LOST");
  const lostDeals = mapDeals(lost?.dealsAggregate, "Lost");

  return [...wonDeals, ...lostDeals].sort((a, b) => a.timeUnix - b.timeUnix);
};
