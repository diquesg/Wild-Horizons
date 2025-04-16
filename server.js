import http from 'node:http'
import { getDataFromDB } from './database/db.js'
import { SendJSONResponse } from './utils/SendJSONResponse.js'
import { getDataByPathParams } from './utils/getDataByParams.js';
import { getDataByQueryParams } from './utils/getDataByQueryParams.js';

const PORT = 8000;

const server = http.createServer(async (req, res) => {

    const urlObj = new URL(req.url, `http://${req.headers.host}`)
    const queryObj = Object.fromEntries(urlObj.searchParams)
    console.log(req.url)

    const destinations = await getDataFromDB()

    if (urlObj.pathname === "/api" && req.method === "GET") {
        let filteredDestinations = getDataByQueryParams(destinations, queryObj)

        console.log(filteredDestinations)
        SendJSONResponse(res, 200, filteredDestinations)

    } else if (req.url.startsWith("/api/continent") && req.method === "GET") {

        const urlString = req.url.split("/").pop()
        const filteredDestinations = getDataByPathParams(destinations, 'continent', urlString)

        SendJSONResponse(res, 200, filteredDestinations)

    } else if (req.url.startsWith("/api/country") && req.method === "GET") {

        const urlString = req.url.split("/").pop()
        const filteredDestinations = getDataByPathParams(destinations, 'country', urlString)

        SendJSONResponse(res, 200, filteredDestinations)

    } else {
        SendJSONResponse(res, 404, { error: "not found", message: "The requested route does not exist." })
    }
})

server.listen(PORT, () => console.log("Server started at port 8000."))