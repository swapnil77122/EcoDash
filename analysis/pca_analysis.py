import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import json
import os

# Load CSV files
renewable_df = pd.read_csv("../public/data/1.csv")
nonrenewable_df = pd.read_csv("../public/data/2.csv")

# Clean and prepare data
renewable_df = renewable_df[renewable_df["Mode of Generation"] != "Total"]
nonrenewable_df = nonrenewable_df[nonrenewable_df["Mode of Generation"] != "Total"]

renewable_df = renewable_df.rename(columns={
    "Mode of Generation": "Mode",
    "Contribution (TWh)": "Renewable"
})
nonrenewable_df = nonrenewable_df.rename(columns={
    "Mode of Generation": "Mode",
    "Contribution (TWh)": "NonRenewable"
})

# Merge datasets
merged_df = pd.merge(renewable_df, nonrenewable_df, on="Mode", how="outer").fillna(0)

# Extract features
features = merged_df[["Renewable", "NonRenewable"]]

# Standardize
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Apply PCA
pca = PCA(n_components=2)
principal_components = pca.fit_transform(features_scaled)

# Prepare JSON output
pca_result = []
for i, row in merged_df.iterrows():
    pca_result.append({
        "Mode": row["Mode"],
        "PC1": float(principal_components[i][0]),
        "PC2": float(principal_components[i][1])
    })

# Ensure output directory exists
os.makedirs("public/data", exist_ok=True)

# Save to JSON
with open("../public/data/pca_energy.json", "w") as f:
    json.dump(pca_result, f, indent=2)

print("✅ PCA analysis completed and saved to public/data/pca_energy.json")
