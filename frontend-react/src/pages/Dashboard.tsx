import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { CpuUsage, User } from 'models';
import { useEffect, useState } from 'react';
import {
  faSignal,
  faPercent,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default function Dashboard() {
  const [latestUserCpuUsage, setLatestUserCpuUsage] = useState<CpuUsage | null>(
    null
  );
  const [userLastHourAvgUsage, setUserLastHourAvgUsage] = useState<
    number | null
  >(null);
  const [usersWithAboveAvgUsage, setUsersWithAboveAvgUsage] = useState<Array<{
    user: User;
    userAvg: number;
  }> | null>(null);
  const [userPercentile, setUserPercentile] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          latestUsageResponse,
          lastHourAvgResponse,
          aboveAvgUsersResponse,
          userPercentileResponse
        ] = await Promise.all([
          axios.get<CpuUsage | null>('http://localhost:8080/cpu-usage'),
          axios.get<number>('http://localhost:8080/last-hour-avg'),
          axios.get<Array<{ user: User; userAvg: number }> | null>(
            'http://localhost:8080/above-avg-usage-users'
          ),
          axios.get<number>('http://localhost:8080/user-percentile')
        ]);

        setLatestUserCpuUsage(latestUsageResponse.data);
        setUserLastHourAvgUsage(lastHourAvgResponse.data);
        setUsersWithAboveAvgUsage(aboveAvgUsersResponse.data);
        setUserPercentile(userPercentileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="ml-10 p-5">
        <header className="pb-5">
          <h1 className="text-3xl font-bold">CPU Usage Dashboard</h1>
        </header>

        <div className="space-y-3">
          <h1 className="text-xl font-bold">My Snapshot</h1>
          <p className="text-sm italic text-gray-400">
            These are your personal CPU usage statistics
          </p>
        </div>
        <div className="stats shadow mt-5">
          <div className="stat">
            <div className="stat-figure text-amber-500">
              <FontAwesomeIcon icon={faSignal} size="2xl" />
            </div>
            <div className="stat-title">Latest</div>
            <div>
              {/* <span className="loading loading-spinner loading-md"></span> */}
            </div>

            <div className="stat-value">
              {latestUserCpuUsage?.usage.toFixed(2)}%
            </div>

            <div className="stat-desc">
              As of {moment(latestUserCpuUsage?.timestamp).format('h:mma')}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-amber-500">
              <FontAwesomeIcon icon={faPercent} size="2xl" />
            </div>
            <div className="stat-title">Percentile</div>
            <div>
              {/* <span className="loading loading-spinner loading-md"></span> */}
            </div>

            <div className="stat-value">{userPercentile}</div>
            <div className="stat-desc">Across all users</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-amber-500">
              <FontAwesomeIcon icon={faClock} size="2xl" />
            </div>
            <div className="stat-title">Hourly Average</div>
            <div>
              {/* <span className="loading loading-spinner loading-md"></span> */}
            </div>

            <div className="stat-value">
              {userLastHourAvgUsage?.toFixed(2)}%
            </div>
          </div>
        </div>
        <h1 className="text-xl font-bold my-5">
          High CPU Usage{' '}
          <div
            className="tooltip"
            data-tip="Users with a higher than average hourly CPU usage"
          >
            <i className="fa fa-info-circle fa-xs" aria-hidden="true"></i>
          </div>
        </h1>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>User ID</th>
                <th>CPU Usage (%)</th>
                <th>Severity Level</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {usersWithAboveAvgUsage?.map((row, i) => (
                  <>
                    <td>{i + 1}</td>
                    <td>{row.user.userUUID}</td>
                    <td>{row.userAvg.toFixed(2)}</td>
                    <td
                      className={
                        row.userAvg > 50
                          ? 'text-red-500'
                          : row.userAvg > 30
                            ? 'text-yellow-500'
                            : 'text-green-500'
                      }
                    >
                      {row.userAvg > 50
                        ? 'High'
                        : row.userAvg > 30
                          ? 'Medium'
                          : 'Low'}
                    </td>
                  </>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
