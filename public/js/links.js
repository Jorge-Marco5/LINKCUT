const listBigShorts = document.getElementById("list-big-shorts");
let urlBigCurrentPage = 1;

async function listBigLinks(page = 1) {
    try {
        const { data } = await axios.get(`/api/link?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        // La nueva estructura devuelve { links: [], meta: {total, page, limit, totalPages} }
        const linksArray = Array.isArray(data.data) ? data.data : data.data.links;
        const meta = data.data.meta;

        if (!linksArray || linksArray.length === 0) {
            listBigShorts.innerHTML = window.generateEmptyLinkHTML();
            return;
        }

        // Obtenemos solo la URL base (ej. http://localhost:3000 o https://midominio.com)
        const baseUrl = window.location.origin + "/";
        if (linksArray.length > 0) {
            let htmlList = linksArray.map(short => window.generateLinkCardHTML(short, baseUrl)).join("");

            // Controles de Paginación UI
            htmlList += window.generatePaginationHTML(meta, 'changeBigUrlPage');

            listBigShorts.innerHTML = htmlList;

            // Render charts for each link
            linksArray.forEach(short => {
                window.renderChartShared(short.id);
            });

        } else {
            listBigShorts.innerHTML = window.generateEmptyLinkHTML();
        }
    } catch (error) {
        console.error(error);
        listBigShorts.innerHTML = window.generateEmptyLinkHTML();
    }
}

// Expone la función de listado globalmente para que refecthee desde Utils
window.listBigLinks = listBigLinks;

function changeBigUrlPage(newPage) {
    urlBigCurrentPage = newPage;
    listBigLinks(urlBigCurrentPage);
}

listBigLinks(urlBigCurrentPage);
