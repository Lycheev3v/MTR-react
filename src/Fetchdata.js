export const getUp = async (lines, sta) => {
    try {
        const api = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lines}&sta=${sta}`;
        const response = await fetch(api);
        const result = await response.json();

        if (result.data[`${lines}-${sta}`].UP) {
            let upNextTime =
                result.data[`${lines}-${sta}`].UP[0].time.split(" ")[1];
            const upPlat = result.data[`${lines}-${sta}`].UP[0].plat;
            const upCurrTime = result.data[`${lines}-${sta}`].curr_time;
            return {
                nextTime: upNextTime,
                platform: upPlat,
                currTime: upCurrTime,
            };
        }
        return null;
    } catch (err) {
        console.log(err);
    }
};

export const getDown = async (lines, sta) => {
    try {
        const api = `https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=${lines}&sta=${sta}`;
        const response = await fetch(api);
        const result = await response.json();

        if (result.data[`${lines}-${sta}`].DOWN) {
            let downNextTime =
                result.data[`${lines}-${sta}`].DOWN[0].time.split(" ")[1];
            const downPlat = result.data[`${lines}-${sta}`].DOWN[0].plat;
            return { nextTime: downNextTime, platform: downPlat };
        }
        return null;
    } catch (err) {
        console.log(err);
    }
};
