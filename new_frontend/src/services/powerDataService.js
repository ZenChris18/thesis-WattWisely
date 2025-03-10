export const fetchPowerData = async (timeframe) => {

    try {
      const url = `http://192.168.254.156:8000/api/power-data/?start=${timeframe}`;
      console.log('Fetching:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching power data:', error);
      return null;
    }
  };
  