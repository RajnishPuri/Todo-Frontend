import React, { useState } from 'react';

const Form = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    async function handleSubmit(e) {


        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/createTodo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObj),
            });

            if (response.ok) {
                // Clear form fields
                setTitle('');
                setDescription('');

                // Update URL without query parameters
                window.history.pushState({}, document.title, window.location.pathname);
            } else {
                console.error('Failed to create todo');
            }
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    }

    return (
        <div className="w-full p-5 flex flex-col gap-5">
            <div>
                <h2 className="text-xl text-purple-300">Create New Todo</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title" className="text-white">Title</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        className="w-full p-2 mt-2 mb-4 rounded-lg bg-gray-800 text-white"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <label htmlFor="desc" className="text-white">Description</label>
                    <textarea
                        name="description"
                        id="desc"
                        className="w-full h-[8rem] p-2 mt-2 mb-4 rounded-lg bg-gray-800 text-white"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className='text-white border p-2 hover:border-purple-300 hover:text-purple-300 duration-100 text-center rounded-lg'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default Form;
