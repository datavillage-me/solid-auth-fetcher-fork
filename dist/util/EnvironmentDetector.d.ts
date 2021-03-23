export declare type environmentName = "browser" | "server" | "react-native";
export interface IEnvironmentDetector {
  detect(): environmentName;
}
export declare function detectEnvironment():
  | "server"
  | "browser"
  | "react-native";
export default class EnvironmentDetector {
  detect(): environmentName;
}
