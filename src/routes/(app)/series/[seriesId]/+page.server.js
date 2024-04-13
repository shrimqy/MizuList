/** @type {import('./$types').PageServerLoad} */
import { db } from '$lib/server/database';
export async function load(locals, params) {
    const seriesId = locals.params.seriesId
    const series = await db.Series.findUnique({
        where: {
            id: seriesId
        },
        include: { 
            SeriesBook: {
                include: {
                    book: {
                        select: {
                            id: true,
                            englishTitle: true,
                            authors: true,
                            Description: true,
                            coverUrl: true,
                            publicRating: true,
                            ratingCount: true,
                            genres: true
                        }
                    } 
                }
            }
        }
    });
    return {
        series
    };
};