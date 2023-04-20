export const authConstant = {
  REGISTER: {
    USER_OR_EMAIL_ALREADY_EXIST: "Username or email is already in use",
    CHECK_MAIL: "Check your email and verify your account",
  },
  VERIFY: {
    TOKEN_INVALID: "Token is invalid",
    SUCCESSFULLY: "User verified successfully",
  },
  LOGIN: {
    ACCOUNT_OR_PASSWORD_INCORRECT: "Account or password incorrect",
    USER_NOT_VERIFIED: "User has not verify account yet",
    SUCCESSFULLY: "User login successfully",
  },
  SESSION: {
    CART_NOT_FOUND: "User's cart not found",
    SUCCESSFULLY: "Session authentication successfully",
  },
  CHANGE_PASSWORD: {
    CHECK_EMAIL: "Check your email to get change passsword link",
    LINK_INVALID: "Recovery link invalid",
    SUCCESSFULLY: "Change password successfully",
  },
  LOGOUT: {
    SUCCESSFULLY: "User logged out",
  },
};

export const cartConstant = {
  INVALID_ACTION: "Invalid action",
  CART_ADD_SUSSESSFULLY: "Cart added successfully.",
  ITEMS_REMOVE_SUSSESSFULLY: "Items removed successfully",
};

export const categoryConstant = {
  NOT_FOUND: "Category not found",
  ADD_SUSSESSFULLY: "Category added successfully",
  UPDATE_SUSSESSFULLY: "Category updated successfully",
  STILL_HAVE_PRODUCT:
    "Some categories still have products, that cannot be removed.",
  DELETE_SUSSESSFULLY: "Category deleted successfully",
};

export const orderConstant = {
  MISSING_INFOMATIONS: "Missing infomations",
  PLACE_ORDER_SUCCESSFULLY: "Place Order Successfully",
  UPDATE_SUCCESSFULLY: "Order updated successfully.",
  CANNOT_CANCEL_COMPLETED: "Cannot cancel completed order",
  CANCEL_SUCCESSFULLY: "Order cancelled successfully",
};

export const productConstant = {
  NOT_FOUND: "Product not found",
  ADD_SUCCESSFULLY: "Product added successfully",
  UPDATE_SUCCESSFULLY: "Product updated successfully",
  DELETE: {
    PRODUCT_IN_CART: "This product has in cart of users",
    SUCCESSFULLY: "Product removed successfully",
  },
};

export const userConstant = {
  EMAIL_EXIST: "Email already exists",
  ADD_CARD_SUCCESSFULLY: "Payment method added successfully",
  UPDATE_PROFILE_SUCCESSFULLY: "Update profile successfully",
  UPDATE_BLOCK_STATUS: "Update user block status successfully",
  DELETE: {
    ACTIVE_USER: "Cannot delete active user",
    SUCCESSFULLY: "User deleted successfully",
  },
};

export const common = {
  USER_NOT_EXIST: "User not exist",
  USER_BLOCKED: "User is blocked from doing this action",
  SERVER_ERROR: "Server error",
  DEFAULT: "Something went wrong",
};
