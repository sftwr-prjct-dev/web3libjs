
const getAsset = async () => {
    const local = (await import("./1337.json")).default
    return ({
        1337: local,
    })
}

export default getAsset

export {}
