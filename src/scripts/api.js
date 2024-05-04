const addTask = async (taskName) => {
    // Update the URL to point to your backend server
    const url = `http://localhost:5501/tasks/add?task_name=${encodeURIComponent(taskName)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        const data = await response.json();
        console.log('Task added successfully:', data);
    } catch (error) {
        console.error('Error adding task:', error.message);
    }
};
