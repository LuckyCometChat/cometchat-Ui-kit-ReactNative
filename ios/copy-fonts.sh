#!/bin/sh

# Create Fonts directory if it doesn't exist
mkdir -p "${PROJECT_DIR}/Fonts"

# Copy fonts from node_modules
cp "${SRCROOT}/../node_modules/react-native-vector-icons/Fonts/"* "${PROJECT_DIR}/Fonts/"

# Add a build phase to copy fonts to the app bundle
if [ "${CONFIGURATION}" = "Debug" ] || [ "${CONFIGURATION}" = "Release" ]; then
  mkdir -p "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Fonts"
  cp "${PROJECT_DIR}/Fonts/"* "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/Fonts/"
fi

echo "Vector icon fonts copied successfully!" 