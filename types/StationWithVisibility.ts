import Station from "./Station";

export default interface StationWithVisibility extends Station {
    isVisible: boolean;
}