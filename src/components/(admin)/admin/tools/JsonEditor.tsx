"use client";

import axios from "axios";

const JsonEditor = {
    async getAll(section: string) {
        try {
            const res = await axios.get(`/api/data/${section}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },

    async getOne(section: string, id: string) {
        try {
            const res = await axios.get(`/api/data/${section}/${id}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    },

    async add(section: string, newData: any) {
        try {
            const res = await axios.post(`/api/data/${section}`, newData);
            return res.status === 200;
        } catch (error) {
            console.error("Error adding data:", error);
            return false;
        }
    },

    async edit(section: string, id: string, updatedData: any) {
        try {
            const res = await axios.patch(`/api/data/${section}/${id}`, updatedData);
            return res.status === 200 ? res.data.updatedData : false;
        } catch (error) {
            console.error("Error editing data:", error);
            return false;
        }
    },

    async delete(section: string, id: string) {
        try {
            const res = await axios.delete(`/api/data/${section}/${id}`);
            return res.status === 200;
        } catch (error) {
            console.error("Error deleting data:", error);
            return false;
        }
    }
};

export default JsonEditor;
