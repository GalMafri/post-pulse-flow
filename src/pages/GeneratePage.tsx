
import PageLayout from "@/components/layout/PageLayout";
import GenerateForm from "@/components/generate/GenerateForm";
import { Button } from "@/components/ui/button";
import { connectToLinkedIn, isLinkedInConnected, getLinkedInUser, disconnectLinkedIn } from "@/services/linkedinService";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const GeneratePage = () => {
  const [connected, setConnected] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check LinkedIn connection status on component mount
    const checkConnection = () => {
      setConnected(isLinkedInConnected());
      setUserData(getLinkedInUser());
    };
    
    checkConnection();
  }, []);

  const handleConnectLinkedIn = async () => {
    setLoading(true);
    try {
      await connectToLinkedIn();
      setConnected(true);
      setUserData(getLinkedInUser());
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectLinkedIn();
    setConnected(false);
    setUserData(null);
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Generate LinkedIn Posts</h1>
          <p className="text-muted-foreground mb-6">
            Create AI-powered LinkedIn content tailored to your style and needs.
          </p>
          
          {/* Review Posts Link */}
          <div className="mb-4">
            <Link to="/approve" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
              Review your pending posts <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {/* LinkedIn Connection Status */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h2 className="text-lg font-medium mb-2">LinkedIn Connection</h2>
            
            {connected ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-3">
                  {userData?.profileImage && (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="text-left">
                    <p className="font-medium">{userData?.name || "Connected User"}</p>
                    <p className="text-sm text-muted-foreground">{userData?.position || "LinkedIn User"}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleDisconnect}>
                  Disconnect LinkedIn
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="mb-3 text-muted-foreground">Connect your LinkedIn account to publish posts directly</p>
                <Button onClick={handleConnectLinkedIn} disabled={loading}>
                  {loading ? "Connecting..." : "Connect to LinkedIn"}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <GenerateForm />
      </div>
    </PageLayout>
  );
};

export default GeneratePage;
