
# Open Media Indexer FE

**Open Media Indexer FE** is a React-based front-end application for visualizing and interacting with media metadata (photos, videos, and locations). It provides an intuitive UI for exploring media collections across time and geography.

---

## Features

- **File Upload**: Load `.msgpack` files containing metadata of media collections.
- **Timeline Filtering**: Filter media by year and navigate through time.
- **Geographical Visualization**: View media locations on an interactive map with clustering support.
- **Data Insights**: Analyze media trends using interactive bar charts.
- **Responsive Design**: Optimized for desktops and mobile devices.

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krunkosaurus/Open-Media-Indexer-FE.git
   cd open-media-indexer-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

---

## Usage

1. Upload a `.msgpack` file containing metadata of your media collection.
2. Use the timeline and time navigator to filter media by specific years and months.
3. Explore geographical media data on the map.
4. Analyze trends in the bar chart views.

---

## File Structure

- **`/src`**: Main source code directory.
  - **`App.js`**: Core application logic.
  - **`DataContext.js`**: Context API for managing global state.
  - **`MapView.js`**: Interactive map component for visualizing locations.
  - **`Timeline.js`**: Timeline filter for selecting media by year.
  - **`ChartsView.js`**: Visualizes media data using charts.
  - **`parseWorker.js`**: Web Worker for processing `.msgpack` files.
  - **`TimeNavigator.js`**: Controls for time-based navigation.

---

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [React](https://reactjs.org/).
- Map functionality powered by [Leaflet](https://leafletjs.com/).
- Data visualization supported by [Recharts](https://recharts.org/).
- Inspired by the need for an open-source media indexing and visualization tool.
