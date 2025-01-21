function validateSearchQuery(query) {
  let errors = [];
  if (!query || typeof query !== "string") {
    errors.push("Query parameter is required and should be a string.");
  }
  return errors;
}
function validateCuratedList(data) {
  let errors = [];
  const { name, description, slug } = data;
  if (!name || typeof name !== "string")
    errors.push("Name is required and should be string");
  if (!description || typeof description !== "string")
    errors.push("description is required and should be string");
  if (!slug || typeof slug !== "string")
    errors.push("slug is required and should be string");

  return errors;
}
function validateReviewAndRating(data) {
  let errors = [];
  const { rating, reviewText } = data;
  if (!rating || typeof rating !== "number") {
    errors.push("Rating should be required and should be float");
  }
  if (rating < 0 || rating > 10) {
    errors.push("Rating should be in between 0 and 10");
  }

  if (!reviewText || typeof reviewText !== "string") {
    errors.push("ReviewText should be required and should be string");
  }
  if (reviewText.length > 500) {
    errors.push("ReviewText Maximum of 500 characters.");
  }
  return errors;
}
module.exports = {
  validateSearchQuery,
  validateCuratedList,
  validateReviewAndRating,
};
