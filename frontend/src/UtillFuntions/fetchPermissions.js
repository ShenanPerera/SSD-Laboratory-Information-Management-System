const fetchPermissions = async ({delay = 1000 , customPermissions = null} = {}
) => {
    console.log('fetchPermissions called');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                 customPermissions || [],
            );
        }, delay);
    });
};

export default fetchPermissions;