import { page } from '$app/stores';
import { customAlphabet } from 'nanoid'
import { db } from '../../../../lib/server/database';

const nanoid = customAlphabet('1234567890', 10)

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    let genres = await db.genres.findMany()
    return {
        genres
    };
};

export const actions = {
    newEntry: async ({ request }) => {
        const data = await request.formData()
        const title = data.getAll("title")
        const author = data.get("author")
        const releaseDate = data.get("releaseDate")
        const isbn = data.get("isbn")
        const chapters = data.get("chapters")
        const publisher = data.get("publisher")
        const pages = data.get("pages")
        const coverUrl = data.get("coverUrl")
        const amazonUrl = data.get("amazonUrl")
        const Description = data.get("description")
        const genres = JSON.parse(data.get("genres"))
		const firstPublished = new Date(data.get('releaseDate')).toISOString();
        const selectedSeries = JSON.parse(data.get("series"))
        const bookPosition = data.get("bookPosition")
        console.log(selectedSeries);
        let bookID = nanoid()

        await db.book.create({
            data: {
                id: bookID,
                romanizedTitle: title[0],
                englishTitle: title[1],
                nativeTitle: title[2],
                authors: author,
                Description: Description,
                isbn: isbn,
                chapters: chapters,
                pages: pages,
                amazonUrl: amazonUrl,
                coverUrl: coverUrl,
                firstPublished: firstPublished,
                publisher: publisher,
                genres: {
                    connect:genres.map(genres => ({ id: genres.id, label: genres.label}))
                },
                SeriesBook: {
                    
                    create: 
                        selectedSeries.map(selectedSeries => (
                        {
                        series: {
                            connect: { id: selectedSeries.seriesID }
                        },     
                        order: bookPosition,               
                    }
                    ))
                
                }
            }
        })
    },

    searchSeries: async ({request}) => {
        const data = await request.formData()
        const searchTerm = data.get("search")

        const searchRes = await db.Series.findMany({
            where: {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }
        })
        return {
            searchRes: searchRes   
        }
    },

    createSeries: async ({request}) => {
        const data = await request.formData()
        const name = data.get("seriesName")
        const description = data.get("description")

        seriesID = nanoid()
        await db.Series.create({
            data: {
                id: seriesID,
                name: name,
                description: description
            }
        })
        return {
            success: true, seriesID: seriesID, seriesName: seriesName
        }
    }
}