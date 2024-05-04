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

const modifyTask = async (taskId, taskProgress, taskName = null) => {
    try {
        const url = `http://localhost:5501/tasks/${taskId}`;
        const bodyData = { task_progress: taskProgress };

        // Include task name in the request body if provided
        if (taskName !== null) {
            bodyData.task_name = taskName;
        }

        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            throw new Error('Failed to modify task');
        }

        const data = await response.json();
        console.log('Task modified successfully:', data);
    } catch (error) {
        console.error('Error modifying task:', error.message);
    }
};

const deleteTask = async (taskId) => {
    try {
        const url = `http://your-backend-server.com/tasks/${taskId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer YOUR_AUTH_TOKEN' // If authentication is required
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        const data = await response.json();
        console.log('Task deleted successfully:', data);
    } catch (error) {
        console.error('Error deleting task:', error.message);
    }
};
