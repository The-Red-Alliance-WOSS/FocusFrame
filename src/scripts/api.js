const getTasks = async () => {
    const url  = `http://localhost:5501/profile`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cookie': "connect.sid=s%3AaJQtH4K4DYm8fBF-PMTtPM97roa4kRsH.9VOvVXpPQfYJX0JGe%2BEi1lAhoMlPhAx6OJKIcxEo6wM"
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get tasks');
        }

        const data = await response.json();
        const tasks = data.tasks;

        return tasks;

    } catch (error) {
        console.error('Error getting tasks:', error.message);
        throw error;
    }

}

// const addTask = async (taskName) => {
//     const url = `http://localhost:5501/tasks/add?task_name=${encodeURIComponent(taskName)}`;

//     try {
//         const response = await fetch(url, {
//             method: 'GET',
//         });

//         if (!response.ok) {
//             throw new Error('Failed to add task');
//         }

//         const data = await response.json();
//         console.log('Task added successfully:', data);
//         return data;
//     } catch (error) {
//         console.error('Error adding task:', error.message);
//         throw error;
//     }
// };

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
        return data;
        console.log('Task modified successfully:', data);
    } catch (error) {
        console.error('Error modifying task:', error.message);
    }
};

const deleteTask = async (taskId) => {
    try {
        const url = `http://localhost:5501/tasks/${taskId}`;
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
