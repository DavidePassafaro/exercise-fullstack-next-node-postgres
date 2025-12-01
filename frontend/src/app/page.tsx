"use client"; // This is a client component 👈🏽

import React, { useState, useEffect } from "react";
import axios from "axios";
import exp from "constants";
import CardComponent from "@/components/CardComponent";

interface User {
  id?: number;
  name: string;
  email: string;
}

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ name: "", email: "" });
  const [updateUser, setUpdateUser] = useState<User>({ name: "", email: "" });

  // Fetch users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/users`, newUser);
      setUsers([response.data, ...users]);
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/users/${updateUser.id}`, {
        name: updateUser.name,
        email: updateUser.email,
      });
      setUsers(
        users.map((user) => {
          if (user.id === +updateUser.id!) {
            return { ...user, name: updateUser.name, email: updateUser.email };
          }
          return user;
        })
      );
      setUpdateUser({ id: "" as unknown as number, name: "", email: "" });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="space-y-4 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          User Management App
        </h1>

        {/* Create user */}
        <form onSubmit={createUser} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </form>

        {/* Update user */}
        <form
          onSubmit={handleUpdateUser}
          className="p-4 bg-green-100 rounded shadow"
        >
          <input
            placeholder="User ID"
            value={updateUser.id}
            type="number"
            onChange={(e) =>
              setUpdateUser({
                ...updateUser,
                id: e.target.value
                  ? +e.target.value
                  : ("" as unknown as number),
              })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={updateUser.name}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, name: e.target.value })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={updateUser.email}
            onChange={(e) =>
              setUpdateUser({ ...updateUser, email: e.target.value })
            }
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Update User
          </button>
        </form>

        {/* Display users */}
        <div className="space-y-2">
          {users.map((user: User) => (
            <div
              key={user.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
            >
              <CardComponent
                card={{ id: user.id!, name: user.name, email: user.email }}
              />
              <button
                onClick={() => deleteUser(user.id!)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete User
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
