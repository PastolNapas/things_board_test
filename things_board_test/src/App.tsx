// Get data from the api:
// https://www.ag-grid.com/example-assets/olympic-winners.json

// Display only 15 values on the line or bar chart with ECharts library.

// The data should be displayed on the chart(pseudocode):
// {
// 	Name: NameOfAthlete,
// 	Data: [goldMedals, silverMedals, bronzeMedals]
// }

// Chart’s container size: 600px*400px

// Legend settings: orient - vertical, right-aligned
// The legend shouldn’t be over the chart.

import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import './App.scss';
import { Person } from './Person';
const API_URL = 'https://www.ag-grid.com/example-assets/olympic-winners.json';

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function getPeople(): Promise<Person[]> {
  await wait(500);
  const response = await fetch(API_URL);
  return await response.json();
}

export const App = () => {
  const [data, setData] = useState<Person[]>([]);

  useEffect(() => {
    const printData = async () => {
      try {
        const peopleFromServer = await getPeople();
        const uniqueNames = new Set();
        const uniquePeople = peopleFromServer.filter((person) => {
          if (!uniqueNames.has(person.athlete)) {
            uniqueNames.add(person.athlete);
            return true;
          }
          return false;
        });
        setData(uniquePeople.slice(0, 15));
      } catch (error) {
        throw new Error('error');
      }
    };

    printData();
  }, []);

  useEffect(() => {
    const chart = echarts.init(
      document.getElementById('chart') as HTMLDivElement
    );
    chart.setOption({
      title: {
        text: 'Olympic Winners',
      },
      color: ['#ffd700', '#c0c0c0', '#cd7f32'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            show: true,
          },
        },
      },
      legend: {
        data: ['Gold', 'Silver', 'Bronze'],
        orient: 'vertical',
        left: 'right',
      },
      xAxis: {
        data: data.map((person) => person.athlete),
        type: 'category',
        axisLabel: { interval: 0, rotate: 30 },
      },
      yAxis: {
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
      },
      series: [
        {
          name: 'Gold',
          type: 'bar',
          data: data.map((person) => person.gold),
        },
        {
          name: 'Silver',
          type: 'bar',
          data: data.map((person) => person.silver),
        },
        {
          name: 'Bronze',
          type: 'bar',
          data: data.map((person) => person.bronze),
        },
      ],
    });
  }, [data]);

  return (
    <div className="App">
      <div id="chart" className="main" />
    </div>
  );
};
