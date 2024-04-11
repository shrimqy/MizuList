/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
export async function load(locals, params) {
    console.log(locals);
    const seriesId = locals.params.seriesId
    const series = await db.Series.findUnique({
        where: {
            id: seriesId
        },
        include: { 
            SeriesBook: true
        }
    });
    return {
        series
    };
};