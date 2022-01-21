import "@testing-library/jest-dom/extend-expect";

declare global {
    interface Window {
        ethereum: ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc
    }
}
