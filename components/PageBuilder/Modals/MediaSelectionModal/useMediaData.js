import { useState, useEffect } from "react";
import { message } from "antd";
import instance from "../../../../axios";

export const useMediaData = (isVisible) => {
    const [mediaList, setMediaList] = useState([]);
    const [sortedMedia, setSortedMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const pageSize = 20; // Default for grid view

    useEffect(() => {
        if (isVisible) {
            console.log("🟡 useMediaData useEffect triggered - isVisible:", isVisible);
            fetchMedia();
            setSearchQuery("");
            setCurrentPage(1);
        }
    }, [isVisible]);

    const fetchMedia = async () => {
        console.log("🟡 fetchMedia called");
        setLoading(true);
        try {
            const response = await instance.get("/media");
            setMediaList(response.data);
            const filteredAndSorted = filterAndSortMedia(
                response.data,
                searchQuery,
                sortOrder,
                filterType
            );
            setSortedMedia(filteredAndSorted);
            setTotalItems(filteredAndSorted.length);
            console.log("🟡 fetchMedia completed");
        } catch (error) {
            message.error("Failed to fetch media items.");
        }
        setLoading(false);
    };

    const filterAndSortMedia = (list, query, order, type) => {
        let filtered = list;

        if (type !== "all") {
            filtered = filtered.filter((media) => {
                if (type === "image") return media.file_type.startsWith("image/");
                if (type === "video") return media.file_type.startsWith("video/");
                if (type === "document")
                    return (
                        !media.file_type.startsWith("image/") &&
                        !media.file_type.startsWith("video/")
                    );
                return true;
            });
        }

        filtered = filtered.filter((media) => {
            const searchText = query.toLowerCase();
            const title = media.title ? media.title.toLowerCase() : "";
            const fileName = media.file_name ? media.file_name.toLowerCase() : "";
            return title.includes(searchText) || fileName.includes(searchText);
        });

        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });

        return sorted;
    };

    const handleSortChange = (value) => {
        setSortOrder(value);
        const filteredAndSorted = filterAndSortMedia(
            mediaList,
            searchQuery,
            value,
            filterType
        );
        setSortedMedia(filteredAndSorted);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const filteredAndSorted = filterAndSortMedia(
            mediaList,
            value,
            sortOrder,
            filterType
        );
        setSortedMedia(filteredAndSorted);
        setCurrentPage(1);
        setTotalItems(filteredAndSorted.length);
    };

    const handleFilterChange = (value) => {
        setFilterType(value);
        const filteredAndSorted = filterAndSortMedia(
            mediaList,
            searchQuery,
            sortOrder,
            value
        );
        setSortedMedia(filteredAndSorted);
        setCurrentPage(1);
        setTotalItems(filteredAndSorted.length);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedMedia = sortedMedia.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return {
        mediaList,
        sortedMedia,
        loading,
        sortOrder,
        searchQuery,
        filterType,
        currentPage,
        totalItems,
        pageSize,
        paginatedMedia,
        fetchMedia,
        handleSortChange,
        handleSearchChange,
        handleFilterChange,
        handlePageChange,
    };
}; 