const NotFoundPage = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1>404 Page Not Found</h1>
      <h2>We are sorry, the page cannot be found</h2>
      <span>
        The words may be misspelled or the page you are looking for is no longer
        available.
      </span>
    </div>
  );
};

export default NotFoundPage;

// const NotFoundPage = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "80vh",
//         textAlign: "center",
//       }}
//     >
//       <h1>404 Page Not Found</h1>
//       <h2>We are sorry, the page cannot be found</h2>
//       <h3>
//         The words may be misspelled or the page you are looking for is no longer
//         available.
//       </h3>
//     </div>
//   );
// };

// export default NotFoundPage;
