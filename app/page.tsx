import MainLayout from "@/components/layout/MainLayout";
import { TestProvider } from "@/components/reflejo/TestContext";
import TestFlow from "@/components/reflejo/TestFlow";

export default function Home() {
  return (
    <MainLayout>
      <TestProvider>
        <TestFlow />
      </TestProvider>
    </MainLayout>
  );
}