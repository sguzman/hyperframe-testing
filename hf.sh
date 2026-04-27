#!/bin/bash

# Hyperframes Helper Script for Linux

# Check for node_modules
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    npm install
fi

# Function to list projects
list_projects() {
    find videos -maxdepth 1 -mindepth 1 -type d | sort
}

# Main menu
echo "------------------------------------------"
echo "   Hyperframes Project Helper (Linux)     "
echo "------------------------------------------"

projects=($(list_projects))

if [ ${#projects[@]} -eq 0 ]; then
    echo "No projects found in videos/ directory."
    exit 1
fi

echo "Select a project:"
for i in "${!projects[@]}"; do
    echo "$((i+1))) ${projects[$i]#videos/}"
done

read -p "Enter project number: " choice

if [[ ! "$choice" =~ ^[0-9]+$ ]] || [ "$choice" -lt 1 ] || [ "$choice" -gt "${#projects[@]}" ]; then
    echo "Invalid choice."
    exit 1
fi

selected_project="${projects[$((choice-1))]}"

echo "------------------------------------------"
echo "Selected: $selected_project"
echo "1) Preview"
echo "2) Render (MP4)"
echo "3) Cancel"
read -p "Select action: " action

case $action in
    1)
        # Preview might need the lib path too
        LD_LIBRARY_PATH=/usr/lib npx hyperframes preview "$selected_project"
        ;;
    2)
        echo "Starting High-Performance Render (8 workers)..."
        LD_LIBRARY_PATH=/usr/lib xvfb-run npx hyperframes render "$selected_project" --workers 8
        ;;
    *)
        echo "Cancelled."
        ;;
esac
