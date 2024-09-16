import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import config from '../config/config.js';

/**
 * useFetch hook for fetching data with axios from an API 
 * @param {string} url - The URL to fetch data from
 * @param {Object} options - Additional options for the fetch request
 * @param {Object} options.params - URL parameters to be sent with the request
 * @param {Object} options.headers - Custom headers to be sent with the request
 * @param {boolean} options.useCache - Whether to use caching (default: false)
 * @param {number} options.cacheTime - Time in milliseconds to keep the cache (default: 5 minutes)
 * @returns {Object} An object containing the loading state, error state, and fetched data
 */
const useFetch = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeRequest = useRef(false);
  const lastEndpoint = useRef('');

  const fetchData = useCallback(async () => {
    if (activeRequest.current || endpoint === lastEndpoint.current) return;
    
    activeRequest.current = true;
    lastEndpoint.current = endpoint;

    const url = `${config.apiBaseUrl}${endpoint}`;

    try {
      setLoading(true);
      setError(null);

      if (config.useCache) {
        const cachedData = localStorage.getItem(url);
        if (cachedData) {
          const { data: cachedResult, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < config.cacheTime) {
            setData(cachedResult);
            setLoading(false);
            activeRequest.current = false;
            return;
          }
        }
      }

      const response = await axios.get(url, {
        params: options.params,
        headers: options.headers,
      });

      if (response.data.chart?.result[0]?.meta) {
        setData(response.data);
        if (config.useCache) {
          localStorage.setItem(
            url,
            JSON.stringify({ data: response.data, timestamp: Date.now() })
          );
        }
      } else {
        throw new Error('Invalid stock symbol or no data available');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No information found for this stock symbol.');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
      setData(null);
    } finally {
      setLoading(false);
      activeRequest.current = false;
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    lastEndpoint.current = '';
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useFetch;