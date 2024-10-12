import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CustomerLeaderBoard from '../components/PatientComponents/CustomerLeaderBoard';
import { useAuthContext } from '../hooks/useAuthContext';
import fetchPermissionsAfterLogIn from '../UtillFuntions/fetchPermissionsAfterLogIn';
import Permission from '../UtillFuntions/Permission';

const Dashboard = ({ code }) => {
  const [dateTime, setformattedDateTime] = useState('');
  const [pendingCount, setPendingCount] = useState(null);
  const [completedCount, setCompletedCount] = useState(null);
  const [pendingSampleCount, setPendingSampleCount] = useState(null);

  const [codeVerifier] = useState(sessionStorage.getItem('code_verifier'));
  const [accessToken, setAccessToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  useEffect(() => {
    console.log('code:', code);
    if (code && codeVerifier) {
      console.log('code and codeVerifier:', code, codeVerifier);
      fetchAccessToken(code, codeVerifier)
        .then((token) => {
          setAccessToken(token);
          console.log(token);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const fetchAccessToken = async (code, codeVerifier) => {
    const response = await fetch(`${process.env.REACT_APP_TOKEN_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REACT_APP_REDIRECT_URL,
        client_id: process.env.REACT_APP_CLIENT_ID,
        code_verifier: codeVerifier,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error('Failed to fetch access token');
    }

    const data = await response.json();
    console.log(data);
    fetchUserInfo(data.access_token);
    return data.access_token;
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_USERINFO_URL}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      console.log(data);
      const isAdmin = await getUserByEmail(data.email);

      if (isAdmin) {
        setIsAdmin(isAdmin);

        setOauthUser(isAdmin);
        fetchPermissionsAfterLogIn({
          fetchFunction: async () => {
            return [Permission.ADMIN];
          },
          afterSet: (permissions) => {
            console.log('permissions:', permissions);
          },
        });

        Cookies.set('accessToken', accessToken, {
          expires: 7,
          secure: true,
          sameSite: 'None',
          path: '/',
        });
        Cookies.set('isAdmin', isAdmin, {
          expires: 7,
          secure: true,
          sameSite: 'None',
          path: '/',
        });

        console.log(Cookies.get('accessToken'));

        navigate('/AdminProfile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserByEmail = async (email) => {
    const response = await fetch('/api/Admin/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    console.log(data);
    return data.username;
  };

  const setOauthUser = (oauthUser) => {
    dispatch({ type: 'SET_OAUTH_USER', payload: oauthUser });
    localStorage.setItem('user', JSON.stringify({ oauthUser }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDateTime = moment().format('h:mm:ss A ddd, D MMM');
      setformattedDateTime(formattedDateTime);
    });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPendingTestResults = async () => {
      try {
        const response = await fetch('/api/testResult/pendingTests');
        const json = await response.json();

        if (response.ok) {
          const pendingCount = json.length;
          setPendingCount(pendingCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPendingTestResults();
  }, []);

  useEffect(() => {
    const fetchTestCompletedResults = async () => {
      try {
        const response = await fetch('/api/testResult/completedTests');
        const json = await response.json();

        if (response.ok) {
          const completedCount = json.length;
          setCompletedCount(completedCount);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchTestCompletedResults();
  }, []);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch('/api/samples/pendingSamples');
        const json = await response.json();

        if (response.ok) {
          setPendingSampleCount(json.length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSamples();
  }, []);

  const navToPendingTests = () => {
    navigate(`/pendingTests`);
  };

  const navToCompletedTests = () => {
    navigate(`/completedTests`);
  };

  const navToPendingAccession = () => {
    navigate(`/pendingAccession`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>

        <h2>{dateTime}</h2>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4 ">
        <div className="col">
          <div
            className="card bg-danger h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navToPendingAccession()}
          >
            {/* <img src="..." className="card-img-top" alt="..." /> */}
            <div className="card-body">
              <h5 className="card-title">
                <FaExclamationTriangle /> Uncollected Samples
              </h5>
              <h1 className="card-title">{pendingSampleCount}</h1>
            </div>
          </div>
        </div>
        <div className="col">
          <div
            className="card  h-100"
            style={{ backgroundColor: '#FFD700', cursor: 'pointer' }}
            onClick={() => navToPendingTests()}
          >
            {/* <img src="" className="card-img-top" alt="..." /> */}
            <div className="card-body">
              <h5 className="card-title">
                <FaClock /> Pending Tests
              </h5>
              <h1 className="card-title">{pendingCount}</h1>
            </div>
          </div>
        </div>
        <div className="col">
          <div
            className="card h-100"
            style={{ backgroundColor: '#3CB371', cursor: 'pointer' }}
            onClick={() => navToCompletedTests()}
          >
            {/* <img src="..." className="card-img-top" alt="..." /> */}
            <div className="card-body">
              <h5 className="card-title">
                <FaCheck /> Completed Tests
              </h5>
              <h1 className="card-title">{completedCount}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5 border bg-white">
        <CustomerLeaderBoard top={3} />
      </div>
    </div>
  );
};

export default Dashboard;
