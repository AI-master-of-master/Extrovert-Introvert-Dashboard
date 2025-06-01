const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../frontend')));

// CSVデータを読み込む関数
function loadData() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, '../Dateset', '外向性 vs. 内向性の行動データ', 'personality_dataset.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// APIエンドポイント: すべてのデータを取得
app.get('/api/data', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// APIエンドポイント: 統計データを取得
app.get('/api/stats', async (req, res) => {
  try {
    const data = await loadData();
    
    // 性格タイプごとにデータを分類
    const extroverts = data.filter(d => d.Personality === 'Extrovert');
    const introverts = data.filter(d => d.Personality === 'Introvert');
    
    // 各指標の平均値を計算
    const calculateAvg = (arr, key) => {
      const validValues = arr
        .map(item => parseFloat(item[key]))
        .filter(val => !isNaN(val));
      
      return validValues.length > 0 
        ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
        : 0;
    };
    
    const stats = {
      counts: {
        extroverts: extroverts.length,
        introverts: introverts.length,
        total: data.length
      },
      averages: {
        extroverts: {
          timeAlone: calculateAvg(extroverts, 'Time_spent_Alone'),
          socialEvents: calculateAvg(extroverts, 'Social_event_attendance'),
          goingOutside: calculateAvg(extroverts, 'Going_outside'),
          friendsCircle: calculateAvg(extroverts, 'Friends_circle_size'),
          postFrequency: calculateAvg(extroverts, 'Post_frequency')
        },
        introverts: {
          timeAlone: calculateAvg(introverts, 'Time_spent_Alone'),
          socialEvents: calculateAvg(introverts, 'Social_event_attendance'),
          goingOutside: calculateAvg(introverts, 'Going_outside'),
          friendsCircle: calculateAvg(introverts, 'Friends_circle_size'),
          postFrequency: calculateAvg(introverts, 'Post_frequency')
        }
      },
      stageFear: {
        extroverts: {
          yes: extroverts.filter(d => d.Stage_fear === 'Yes').length,
          no: extroverts.filter(d => d.Stage_fear === 'No').length
        },
        introverts: {
          yes: introverts.filter(d => d.Stage_fear === 'Yes').length,
          no: introverts.filter(d => d.Stage_fear === 'No').length
        }
      },
      drainedAfterSocializing: {
        extroverts: {
          yes: extroverts.filter(d => d.Drained_after_socializing === 'Yes').length,
          no: extroverts.filter(d => d.Drained_after_socializing === 'No').length
        },
        introverts: {
          yes: introverts.filter(d => d.Drained_after_socializing === 'Yes').length,
          no: introverts.filter(d => d.Drained_after_socializing === 'No').length
        }
      }
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// メインページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
}); 