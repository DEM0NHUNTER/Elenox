import os


def extract_filepaths(target_dir, output_filename):
    # Open the text file in write mode
    with open(output_filename, 'w', encoding='utf-8') as outfile:

        # os.walk goes through all directories and files
        for root, dirs, files in os.walk(target_dir):

            # If 'node_modules' is in the directory list, remove it
            # This prevents os.walk from searching inside it
            if 'node_modules' in dirs:
                dirs.remove('node_modules')

            # Write each file's full path to the text file
            for file in files:
                full_path = os.path.join(root, file)
                outfile.write(full_path + '\n')

    print(f"Done! File paths have been saved to {output_filename}")


# --- Set your directories here ---
directory_to_scan = '.'  # '.' means the current directory
output_text_file = 'output.txt'  # Name of the output file

extract_filepaths(directory_to_scan, output_text_file)